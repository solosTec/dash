import { hasPrivileges, hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "@/store/index";
import { MODULES, PRIVILEGES } from "@/store/modules/user";

describe("privileges mixin", () => {
  beforeEach(() => {
    store.commit("user/reset");
  });

  it("should check the privileges if the store is not poluted with the user", () => {
    const hasPrivilges = hasPrivileges(
      store,
      MODULES.MONITOR_LORA,
      PRIVILEGES.VIEW
    );
    expect(hasPrivilges).toBeFalsy();
  });

  it("should check the privileges if the store is poluted with the user", () => {
    store.commit("user/loaded", {});
    const hasPrivilges = hasPrivileges(
      store,
      MODULES.MONITOR_LORA,
      PRIVILEGES.VIEW
    );
    expect(hasPrivilges).toBeTruthy();
  });

  it("should wait for the user data to be loaded", done => {
    hasPrivilegesWaitForUser(store, MODULES.MONITOR_LORA, PRIVILEGES.VIEW).then(
      res => {
        expect(res).toBeTruthy();
        done();
      }
    );
    store.commit("user/loaded", {});
  });

  it("should not wait for the user data to be loaded - if the data is already loaded", done => {
    store.commit("user/loaded", {});
    hasPrivilegesWaitForUser(store, MODULES.MONITOR_LORA, PRIVILEGES.VIEW).then(
      res => {
        expect(res).toBeTruthy();
        done();
      }
    );
  });
});
