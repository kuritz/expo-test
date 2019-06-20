export default (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.loadingStatus
      };
    case "SET_USER":
      return {
        ...state,
        user: action.user
      };
    case "SET_CITY":
      return {
        ...state,
        city: action.city
      };
    case "UPDATE_PLAYLIST":
      return {
        ...state,
        playlist: action.playlist
      };

    default:
      return state;
  }
};
