import { format, utcToZonedTime } from 'date-fns-tz';
import { ContactFormMessage, Event, Registration } from '../interfaces';
import { formatPhoneNumber, formatToMoney } from '../utils/misc';

type Races = {
  name: string;
  price: number | undefined;
}[];

function generateConfirmationTextEmail(
  r: Registration,
  e: Event,
  year: number,
  races: Races
) {
  return `Hi ${
    r.firstName
  },\n\nYou have successfully registered for the ${year} ${
    e.name
  }. Below you will see your registration details.\n\n\nRegistration Details:\n\nRegistration ID: ${
    r.id
  }\nPayment ID: ${r.stripeId}\nTimestamp: ${format(
    utcToZonedTime(new Date(r.createdAt), 'America/Chicago'),
    "LLLL do, yyyy 'at' pp"
  )}\n\nName: ${r.firstName} ${r.lastName}\nEmail: ${
    r.email
  }\nPhone: ${formatPhoneNumber(r.phone)}\nHometown: ${r.city}, ${
    r.state
  }\nAge: ${r.age}\nGender: ${
    r.gender === 'female' ? 'Female' : 'Male'
  }\n\nRace${r.races.length > 1 ? 's' : ''}: ${races
    .map(
      race =>
        `${race.name}${race.price ? ` (${formatToMoney(race.price)})` : null}\n`
    )
    .join('')}\n\nSubtotal: ${formatToMoney(
    r.summary.subtotal
  )}\nTrail fee: ${formatToMoney(r.summary.trailFee)}\n${
    r.summary.isdraFee > 0
      ? `ISDRA fee: ${formatToMoney(r.summary.isdraFee)}`
      : ''
  }\nTotal: ${formatToMoney(r.summary.total)}`;
}

function generateConfirmationHtmlEmail(
  r: Registration,
  e: Event,
  year: number,
  races: Races
) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>${year} ${e.name} Registration</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="color-scheme" content="only" />
      <style type="text/css">
        /* CLIENT_SPECIFIC STYLES */
        body,
        table,
        td,
        a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        /* RESET STYLES */
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
  
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
  
        /* GMAIL BLUE LINKS */
        u + #body a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* SAMSUNG MAIL BLUE LINKS */
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* Universal styles for links and stuff */
  
        /* Responsive styles */
        @media screen and (max-width: 600px) {
          .mobile {
            padding: 0 !important;
            width: 100% !important;
          }
  
          .mobile-padding {
            padding: 0 24px !important;
          }
        }
  
        @media screen and (max-width: 500px) {
          .mobile-full-width {
            width: 100% !important;
          }
  
          .item-title {
            padding: 14px 0 0 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.25px !important;
            font-weight: bold !important;
          }
        }
      </style>
    </head>
    <body
      id="body"
      bgcolor="#f4f5f8"
      style="
        margin: 0 !important;
        padding: 0 !important;
        background-color: #f4f5f8 !important;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        width="100%"
      >
        <tr>
          <td align="center" style="padding: 24px 0 0" class="mobile">
            <table
              class="mobile"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              width="600"
              bgcolor="#ffffff"
              style="
                background-color: #ffffff !important;
                color: #393a3d !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                  sans-serif;
                font-size: 18px;
                line-height: 36px;
                margin: 0;
                padding: 0;
              "
            >
              <tr>
                <td style="padding: 0 64px" class="mobile-padding">
                  <table
                    class="mobile"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <!-- Logo -->
                    <tr>
                      <td align="center" style="padding: 48px 0 4px; text-align: center;">
                        <img src="${
                          e.tag === 'fall'
                            ? 'https://res.cloudinary.com/dra3wumrv/image/upload/v1646708697/3d-mushing-events/fall-logo.png'
                            : 'https://res.cloudinary.com/dra3wumrv/image/upload/v1646708697/3d-mushing-events/winter-logo.png'
                        }" alt="${e.name}" width="72" />
                      </td>
                    </tr>
  
                    <!-- Event Title -->
                    <tr>
                      <td style="padding: 0; line-height: 1">
                        <h1
                          style="
                            margin: 0;
                            font-size: 20px;
                            font-weight: 500;
                            color: #1f2937 !important;
                            text-align: center;
                            line-height: 1.35;
                          "
                        >
                          ${year} <br />${e.name} Registration
                        </h1>
                      </td>
                    </tr>
  
                    <!-- Registration Number -->
                    <tr>
                      <td style="padding: 0 0 32px">
                        <h2
                          style="
                            margin: 0;
                            padding: 10px 0;
                            font-size: 16px;
                            font-weight: 400;
                            color: #6b7280;
                            text-align: center;
                            line-height: 1;
                          "
                        >
                          #${r.id}
                        </h2>
                      </td>
                    </tr>
  
                    <!-- Confirmation paragraph -->
                    <tr>
                      <td
                        style="
                          padding: 0 0 16px;
                          font-size: 15px;
                          line-height: 1.65;
                        "
                      >
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td style="color: #374151">Hi ${r.firstName},</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          padding: 0 0 10px;
                          font-size: 15px;
                          line-height: 1.5;
                        "
                      >
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td style="color: #374151">
                              This is confirmation for your ${year} ${e.name}
                              registration.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Participant information -->
                    <tr>
                      <td style="padding: 36px 0 12px">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                           <td
                            style="
                              padding: 0 0 8px 0;
                              font-size: 13px;
                              font-weight: 600;
                              color: #1f2937;
                              text-transform: uppercase;
                              letter-spacing: 0.5px;
                              line-height: 1.65;
                            "
                           >
                            Participant details
                           </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                padding: 0;
                                font-size: 15px;
                                font-weight: 400;
                                color: #1f2937;
                                line-height: 1.25;
                              "
                            >
                              ${r.firstName} ${r.lastName}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                padding: 3px 0 0 0;
                                font-size: 15px;
                                font-weight: 400;
                                color: #1f2937;
                                line-height: 1.25;
                              "
                            >
                              ${r.city}, ${r.state}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                padding: 3px 0 0 0;
                                font-size: 15px;
                                font-weight: 400;
                                color: #1f2937;
                                line-height: 1.25;
                              "
                            >
                              ${r.email}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                padding: 3px 0 0 0;
                                font-size: 15px;
                                font-weight: 400;
                                color: #1f2937;
                                line-height: 1.25;
                              "
                            >
                              ${formatPhoneNumber(r.phone)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                padding: 3px 0 0 0;
                                font-size: 15px;
                                font-weight: 400;
                                color: #1f2937;
                                line-height: 1.25;
                              "
                            >
                              ${r.gender === 'female' ? 'Female' : 'Male'} - ${
    r.age
  }
                            </td>
                          </tr>
                          ${
                            r.guardian
                              ? `<tr>
                          <td
                            style="
                              padding: 3px 0 0 0;
                              font-size: 15px;
                              font-weight: 400;
                              color: #1f2937;
                              line-height: 1.25;
                            "
                          >
                          ${r.guardian}
                          </td>
                        </tr>`
                              : ''
                          }
                        </table>
                      </td>
                    </tr>

                    <!-- Races -->
                    <tr>
                      <td style="padding: 36px 0 8px">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td
                              style="
                                font-size: 13px;
                                font-weight: 600;
                                color: #1f2937;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                                line-height: 1.65;
                              "
                            >
                              Race${r.races.length > 1 ? 's' : ''}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ${races
                      .map(
                        r => `
                    <tr>
                      <td style="padding: 0; font-size: 15px">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                          style="background-color: #f3f4f6; border-top: 3px solid #ffffff;"
                        >
                          <tr>
                            <td style="padding: 0 20px">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding: 18px 0;
                                      color: #374151;
                                      line-height: 1;
                                    "
                                  >
                                    <table
                                      align="left"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tr>
                                        <td>
                                          <div
                                            style="
                                              padding: 0;
                                              font-size: 14px;
                                              font-weight: 500;
                                              color: #374151;
                                            "
                                          >
                                            ${r.name} ${
                          r.price ? `(${formatToMoney(r.price)})` : ''
                        }
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    `
                      )
                      .join('')}
                    <!-- Registration Totals -->
                    <tr>
                      <td
                        style="
                          padding: 36px 0 42px;
                          font-size: 15px;
                          color: #6b7280;
                          line-height: 1.5;
                        "
                      >
                        <table
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td style="font-weight: 400; color: #1f2937">
                              Subtotal
                            </td>
                            <td
                              style="
                                text-align: right;
                                font-weight: 400;
                                color: #1f2937;
                              "
                            >
                              ${formatToMoney(r.summary.subtotal, true)}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-weight: 400; color: #1f2937">
                              Trail fee
                            </td>
                            <td
                              style="
                                text-align: right;
                                font-weight: 400;
                                color: #1f2937;
                              "
                            >
                              ${formatToMoney(r.summary.trailFee, true)}
                            </td>
                          </tr>
                          ${
                            r.summary.isdraFee > 0
                              ? `<tr>
                          <td style="font-weight: 400; color: #1f2937">
                            ISDRA fee
                          </td>
                          <td
                            style="
                              text-align: right;
                              font-weight: 400;
                              color: #1f2937;
                            "
                          >
                            ${formatToMoney(r.summary.isdraFee, true)}
                          </td>
                        </tr>`
                              : ''
                          }
                          <tr>
                            <td style="font-weight: 500; color: #000000">
                              Total
                            </td>
                            <td
                              style="
                                text-align: right;
                                font-weight: 500;
                                color: #000000;
                              "
                            >
                              ${formatToMoney(r.summary.total, true)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Questions and contact -->
                    <tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td
                              style="
                                padding: 28px 0;
                                font-size: 14px;
                                color: #6b7280;
                                line-height: 1.5;
                                border-top: 1px solid #e5e7eb;
                                border-bottom: 1px solid #e5e7eb;
                              "
                            >
                              <p style="margin: 0">
                                If you have any questions about your payment or
                                registration, please contact us at
                                <a
                                  href="mailto:todo-add-email?subject=Registration Inquiry [#${
                                    r.id
                                  }]"
                                  style="color: #1d4ed8; text-decoration: none"
                                  >todo-add-email-address@email.com</a
                                >.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Footer -->
                    <tr>
                      <td
                        style="
                          padding: 40px 0;
                          color: #6b7280;
                          font-size: 14px;
                          line-height: 1.4;
                        "
                      >
                        <p style="margin: 0 0 20px 0">
                          You're receiving this email because you registered for ${
                            e.name
                          } at
                          <a
                            href="https://3dmushingevents"
                            style="color: #1d4ed8; text-decoration: none"
                            >3dmushingevents.com</a
                          >.
                        </p>
                        <p style="margin: 0 0 20px 0">
                          <a
                            href="https://3dmushingevents/event/${
                              e.tag
                            }/-confirmation?id=${r.id}"
                            style="color: #1d4ed8; text-decoration: none"
                            >Click here</a
                          >
                          to view your registration in the web browser.
                        </p>
                        <p style="margin: 0">
                          3D Mushing Events - 14899 County Road T
                          Mountain, WI 54149.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function generateAdminNotificationEmail(
  r: Registration,
  e: Event,
  year: number,
  races: Races
) {
  return `${year} ${e.name} Registration\n\nRegistration ID: ${
    r.id
  }\nStripe ID: ${r.stripeId}\nTimestamp: ${format(
    utcToZonedTime(new Date(r.createdAt), 'America/Chicago'),
    "LLLL do, yyyy 'at' pp"
  )}\n\nName: ${r.firstName} ${r.lastName}\nEmail: ${
    r.email
  }\nPhone: ${formatPhoneNumber(r.phone)}\nHometown: ${r.city}, ${
    r.state
  }\nAge: ${r.age}\nGender: ${
    r.gender === 'female' ? 'Female' : 'Male'
  }\n\nRace${r.races.length > 1 ? 's' : ''}:\n${races
    .map(
      race =>
        `${race.name}${race.price ? ` (${formatToMoney(race.price)})` : null}\n`
    )
    .join('')}\n\nSubtotal: ${formatToMoney(
    r.summary.subtotal
  )}\nTrail fee: ${formatToMoney(r.summary.trailFee)}${
    r.summary.isdraFee > 0
      ? `\nISDRA fee: ${formatToMoney(r.summary.isdraFee)}`
      : ''
  }\nTotal: ${formatToMoney(r.summary.total)}`;
}

export function generateConfirmationEmail(
  registration: Registration,
  event: Event
) {
  const year = new Date(event.dates[0]).getFullYear();
  const races = registration.races.map(rId => {
    const eventRace = event.races.find(eRace => eRace.id === rId);
    return {
      name: `${eventRace?.sled} ${eventRace?.category}${
        eventRace?.breed ? ` - ${eventRace.breed}` : ''
      }`,
      price: eventRace?.price,
    };
  });

  const text = generateConfirmationTextEmail(registration, event, year, races);
  const html = generateConfirmationHtmlEmail(registration, event, year, races);
  const adminTextEmail = generateAdminNotificationEmail(
    registration,
    event,
    year,
    races
  );
  return { text, html, adminTextEmail };
}

export function generateContactFormEmail(message: ContactFormMessage) {
  return `3D Mushing Events Conact Form Message\n\nID: ${
    message.id
  }\nTimestamp: ${format(
    utcToZonedTime(new Date(), 'America/Chicago'),
    "LLLL do, yyyy 'at' pp"
  )}\n\nName: ${message.name}\nEmail: ${message.email}\nPhone: ${
    message.phone
  }\n\nMessage:\n${
    message.message
  }\n\n\n*This message was sent from the contact form on 3dmushingevents.com.`;
}
