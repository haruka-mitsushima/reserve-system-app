import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { cleanup, render, screen } from "@testing-library/react";
import AddItem from "../components/AddItem";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const handlers = [
  rest.post("http://localhost:8000/Items", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});

describe("AddItem", () => {
  it("1 Should render all the elements correctly", () => {
    render(<AddItem />);
    expect(screen.getByRole("heading")).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("select")).toBeTruthy();
    expect(screen.getByTestId("button")).toBeTruthy();
  });
});
