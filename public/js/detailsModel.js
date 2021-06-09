import { CONSTANTS } from "./config.js";
import { CONVERT_MILLIS_TO_MINS_SECONDS } from "./helpers.js";
import { GET_JSON } from "./helpers.js";
import { SHORTEN_STRING } from "./helpers.js";
import { CONSTRUCT_URL_PART } from "./helpers.js";
/*
https://musicbrainz.org/ws/2/recording/738920d3-c6e6-41c7-b504-57761bb625fd?inc=genres+artists+ratings+releases&fmt=json
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
    /* Première méthode pour "nettoyer" les releases
    const releasesReduced = [];
    const titleNotExist = (title) => {
      return releasesReduced.every((release) => {
        if (release.title === title) return false;
        return true;
      });
    };
    trackData["releases"].forEach((release) => {
      if (titleNotExist(release.title))
        releasesReduced.push({ id: release.id, title: release.title });
    });
    */

    details.trackDetails = {
      trackTitle: trackData.title ?? "No title provided",
      trackID: trackData.id,
      trackReleaseDate: trackData["first-release-date"] ?? "No date provided",
      trackLength: trackData.length
        ? CONVERT_MILLIS_TO_MINS_SECONDS(trackData.length)
        : "No duration provided",
      trackArtists: trackData["artist-credit"].length
        ? trackData["artist-credit"]
        : "No information on artists",
      trackReleasesBase: trackData["releases"].length
        ? trackData["releases"]
        : "No information on releases",
      trackReleasesCleanOne: trackData["releases"].length
        ? trackData["releases"].map((release) => ({
            id: release.id,
            title: release.title,
          }))
        : "No information on releases",
      /*
        .reduce((accumulator, currentValue, currentIndex, sourceArray) => {
          if (!accumulator.find((a) => a.title === currentValue.title)) {
            accumulator.push(currentValue);
          }

          return accumulator;
        }, []),
        */
      /*
      trackReleasesCleanTwo: releasesReduced,
      */
      trackGenres: trackData["genres"].length
        ? trackData["genres"]
        : "No information on genres",
      trackRating: trackData.rating.value ?? "No rating yet",
    };

    console.log(details.trackDetails);
  } catch (err) {
    throw err;
  }
};
