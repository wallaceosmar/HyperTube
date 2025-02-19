import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@/tests/__mocks__/matchMedia";
import Navbar from "@/components/Navbar";
import i18n from "@/locales/i18n";
import StoreContextProvider from "@/state/store";

describe("Snapshots", () => {
  test("renders correctly on desktop", () => {
    const { container: desktop } = render(
      <StoreContextProvider>
        <Navbar />
      </StoreContextProvider>,
    );
    expect(desktop).toMatchSnapshot();
  });

  test("renders correctly on mobile", () => {
    const { container: mobile } = render(
      <StoreContextProvider>
        <Navbar />
      </StoreContextProvider>,
    );
    expect(mobile).toMatchSnapshot();
    userEvent.click(screen.getByTestId("menuburger-icon"));
    expect(mobile).toMatchSnapshot();
  });
});

describe("Navbar on mobile", () => {
  test("burger menu ", () => {
    render(
      <StoreContextProvider>
        <Navbar />
      </StoreContextProvider>,
    );

    expect(screen.queryByTestId("cross-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("menuburger-icon")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("menuburger-icon"));
    expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("menuburger-icon")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("cross-icon"));
    expect(screen.queryByTestId("cross-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("menuburger-icon")).toBeInTheDocument();
  });
});

describe("Navbar on desktop", () => {
  const mockChangeLanguage = jest.spyOn(i18n, "changeLanguage");

  test("search input update its value through context", () => {
    render(
      <StoreContextProvider>
        <Navbar />
      </StoreContextProvider>,
    );

    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    userEvent.click(screen.getAllByTestId("magnifier-icon")[1]);
    const input = screen.getByPlaceholderText(/search/i);
    userEvent.type(input, "Scrubs");
    expect(input).toHaveValue("Scrubs");
    userEvent.click(screen.getByTestId("submit-search"));
    userEvent.click(screen.getByTestId("close-search"));
    expect(screen.queryByTestId(/search/i)).not.toBeInTheDocument();
  });

  test("display user menu", () => {
    render(<Navbar />);
    expect(screen.queryByText(/Account/i)).not.toBeInTheDocument();
    userEvent.hover(screen.getByText(/AD/i));

    const accountLink = screen.getByText(/Account/i) as HTMLLinkElement;
    expect(accountLink).toBeInTheDocument();
    expect(accountLink.href).toEqual("http://localhost/account");

    const logoutLink = screen.getByText(/Logout/i) as HTMLLinkElement;
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink.href).toEqual("http://localhost/logout");
  });

  test("change language", () => {
    render(<Navbar />);

    expect(screen.queryByText(/English/i)).not.toBeInTheDocument();
    userEvent.hover(screen.getByTestId("lang-flag-hoverable"));
    expect(screen.getByText(/English/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(/French/i));
    expect(mockChangeLanguage).toHaveBeenCalledWith("fr");
  });
});
