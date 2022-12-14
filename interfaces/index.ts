import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export interface Race {
  id: string;
  sled: string;
  category: string;
  breed: string;
  notes: string[];
  price: number;
  isdraFee: boolean;
  total?: number;
}

export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  guardian: string | null;
  gender: 'male' | 'female';
  email: string;
  phone: string;
  city: string;
  state: string;
  races: string[];
  summary: {
    trailFee: number;
    isdraFee: number;
    subtotal: number;
    total: number;
    stripeFee: number;
  };
  stripeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sponsor {
  name: string;
  imgUrl: string;
  websiteUrl: string;
}

export interface Event {
  _id: string;
  name: string;
  dates: string[];
  races: Race[];
  registrations: Registration[];
  logo: string;
  tag: 'fall' | 'winter';
  trailFee: number;
  isdraRaceFee: number;
  sponsors: Sponsor[];
  facebookUrl: string;
}

export interface InitialFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  age: string;
  guardian: string;
  races: string[];
  cardholder: string;
}

export interface RegistrationConfirmation {
  notFound: boolean;
  registration?: Registration;
  name: string;
  dates: string[];
  tag: 'fall' | 'winter';
  races: Race[];
  facebookUrl: string;
}

export interface ContactFormMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ExtendedNextApiRequest extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
}

type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;
