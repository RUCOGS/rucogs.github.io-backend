import { RequestHandler } from 'express';

export const allAccess = function(req, res) {
  res.status(200).send('Public Content.');
} as RequestHandler;

export const userBoard = function(req, res) {
  res.status(200).send('User Content.');
} as RequestHandler;

export const adminBoard = function(req, res) {
  res.status(200).send('Admin Content.');
} as RequestHandler;

export const moderatorBoard = function(req, res) {
  res.status(200).send('Moderator Content.');
} as RequestHandler;
