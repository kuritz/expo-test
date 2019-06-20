
export function setLoading(boolean) {
  return {
    type: "SET_LOADING",
    loadingStatus: boolean
  };
}

export function setCity(iata) {
  return {
    type: "SET_CITY",
    city: iata
  };
}

export function setUser(username) {
  return {
    type: "SET_USER",
    user: username
  };
}

export function updatePlaylist(obj) {
  return {
    type: "UPDATE_PLAYLIST",
    playlist: obj
  };
}
