import websocketModule from "@/store/modules/websocket";

const { eventState, eventRx, eventSx } = websocketModule.mutations;

describe("websocket store", () => {
  let state: any;

  beforeEach(() => {
    state = {
      state: "unknown",
      rx: 1,
      sx: 0
    };
  });

  it("should set the ws state", () => {
    expect(state.state).toEqual("unknown");
    eventState(state, "online");
    expect(state.state).toEqual("online");
  });

  it("should update the rx state", () => {
    expect(state.rx).toEqual(1);
    eventRx(state, 10);
    expect(state.rx).toEqual(11);
  });

  it("should update the sx state", () => {
    expect(state.sx).toEqual(0);
    eventSx(state, 10);
    expect(state.sx).toEqual(10);
  });
});
