const journeyVerhuizen = 'verhuizen';

const knownJourneys = [
  {
    name: journeyVerhuizen,
    id: 'fc79c4c9-b3b3-4258-bdbb-449262f3e5d7',
  }];

export const getJourneyId = (journeyName) => {
  for (var journeyCounter = 0; journeyCounter < knownJourneys.length; journeyCounter++) {
    var journey = knownJourneys[journeyCounter];
    if (journey.name.toLowerCase() === journeyName.toLowerCase()) {
      return journey.id;
    }
  }

  return undefined;
};

