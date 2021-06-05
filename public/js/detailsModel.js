import { CONSTANTS } from "./config.js";

import { GET_JSON } from "./helpers.js";
import { SHORTEN_STRING } from "./helpers.js";
import { CONSTRUCT_URL_PART } from "./helpers.js";
/*
https://musicbrainz.org/ws/2/recording/738920d3-c6e6-41c7-b504-57761bb625fd?inc=genres+artists+ratings+release-group&fmt=json
loadTrackDetail("738920d3-c6e6-41c7-b504-57761bb625fd");
*/
export const details = {
  trackDetails: {},
  artistDetails: {},
  releaseDetails: {},
};

export const loadTrackDetail = async function (id) {
  try {
    const trackData = await GET_JSON(
      encodeURI(
        `${CONSTANTS.API_URL}${id}?inc=genres+artists+ratings+releases&fmt=json`
      )
    );
    details.trackDetails = {
      trackTitle: trackData.title,
      trackArtists: trackData["artist-credit"],
      trackReleases: trackData["releases"],
      trackGenres: trackData["genres"],
      trackRating: trackData.rating.value,
    };

    console.log(details.trackDetails);
  } catch (err) {
    throw err;
  }
};
