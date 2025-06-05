import reducer, { setUser, clearUser } from "./authSlice";

describe("authSlice", () => {
  const initialState = { user: null };

  const fakeUser = {
    uid: "test-uid",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: "http://test/photo.jpg",
  };

  it("should return the initial state by default", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should set user with setUser action", () => {
    const state = reducer(initialState, setUser(fakeUser));
    expect(state.user).toEqual(fakeUser);
  });

  it("should clear user with clearUser action", () => {
    const stateWithUser = { user: fakeUser };
    const state = reducer(stateWithUser, clearUser());
    expect(state.user).toBeNull();
  });
});
