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
  races: Race[];
  summary: {
    trailFee: number;
    isdraFee: number;
    subtotal: number;
    total: number;
    stripeFee: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  name: string;
  dates: string[];
  races: Race[];
  registrations: Registration[];
  logo: string;
  tag: 'fall' | 'winter';
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

export interface ExtendedNextApiRequest extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
}
