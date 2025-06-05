jest.mock("shared/api/firebase", () => ({
  auth: {},
}));

import { signInWithGoogle } from "./authService";
import * as firebaseAuth from "firebase/auth";
import { auth } from "shared/api/firebase";

const mockProviderInstance = {
  setCustomParameters: jest.fn(),
};

jest.mock("firebase/auth", () => {
  const mockSignInWithPopup = jest.fn();
  const MockGoogleAuthProvider = jest
    .fn()
    .mockImplementation(() => mockProviderInstance);
  return {
    signInWithPopup: mockSignInWithPopup,
    GoogleAuthProvider: MockGoogleAuthProvider,
  };
});

describe("signInWithGoogle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the user and call setCustomParameters when signing-in succeeds", async () => {
    const mockSignIn =
      firebaseAuth.signInWithPopup as unknown as jest.MockedFunction<
        typeof firebaseAuth.signInWithPopup
      >;

    const fakeUser = { uid: "user-123", displayName: "Tester" };
    mockSignIn.mockResolvedValue({ user: fakeUser } as any);

    const result = await signInWithGoogle();

    const MockProviderClass =
      firebaseAuth.GoogleAuthProvider as jest.MockedClass<
        typeof firebaseAuth.GoogleAuthProvider
      >;
    expect(MockProviderClass).toHaveBeenCalledTimes(1);
    expect(mockProviderInstance.setCustomParameters).toHaveBeenCalledWith({
      prompt: "select_account",
    });
    expect(mockSignIn).toHaveBeenCalledWith(auth, mockProviderInstance);
    expect(result).toEqual(fakeUser);
  });

  it("should throw the same error and still create the provider when signing-in fails", async () => {
    const mockSignIn =
      firebaseAuth.signInWithPopup as unknown as jest.MockedFunction<
        typeof firebaseAuth.signInWithPopup
      >;

    const fakeError = new Error("Firebase fail");
    mockSignIn.mockRejectedValue(fakeError);

    await expect(signInWithGoogle()).rejects.toThrow("Firebase fail");

    const MockProviderClass =
      firebaseAuth.GoogleAuthProvider as jest.MockedClass<
        typeof firebaseAuth.GoogleAuthProvider
      >;
    expect(MockProviderClass).toHaveBeenCalledTimes(1);
    expect(mockProviderInstance.setCustomParameters).toHaveBeenCalledWith({
      prompt: "select_account",
    });
    expect(mockSignIn).toHaveBeenCalledWith(auth, mockProviderInstance);
  });
});
