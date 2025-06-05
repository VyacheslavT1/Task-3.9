import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = function () {};
  HTMLDialogElement.prototype.close = function () {};
}

Element.prototype.scrollTo = jest.fn();

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
