import express, { Response } from "express";

export interface CustomResponse extends Response {
  id?: string;
}

export type Client = {
  gtkUserId: string;
  res: CustomResponse;
  resId: string;
};
