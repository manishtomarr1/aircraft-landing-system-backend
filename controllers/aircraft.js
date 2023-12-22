import Airport from "../modals/airport.js";

export const getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.find(); //find all airports
    res.json(airports);
  } catch (error) {
    console.error("Error fetching airports:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const manageLanding = async (req, res) => {
  try {
    const airportID = req.params.airportID;
    const airport = await Airport.findOne({ airportID });

    if (!airport) {
      return res.status(404).json({ message: "Airport not found" });
    }

    const currentTime = new Date();
    const busyDuration = 60000;
    const bufferTime = 1000; //for better security we take 1 sec

    if (airport.isBusy) {
      const timePassed = currentTime.getTime() - airport.lastLanding.getTime();
      let timeRemaining = busyDuration - timePassed;

      if (timeRemaining <= bufferTime) {
        // compare the buffer -> resolve sync of front end to backend
        airport.isBusy = false;
        await airport.save();
        timeRemaining = 0;
      }

      return res.status(400).json({
        message: "Airport is currently busy", //all the messages is going from backend
        timeRemaining: Math.round(timeRemaining / 1000),
      });
    }

    // Update the airport as busy and set the last landing time
    airport.isBusy = true;
    airport.lastLanding = new Date();
    await airport.save();

    //after 60 seconds isBusy is automatically false
    setTimeout(async () => {
      try {
        const updatedAirport = await Airport.findOne({ airportID });
        updatedAirport.isBusy = false;
        await updatedAirport.save();
      } catch (error) {
        console.error("Error updating airport status:", error.message);
      }
    }, busyDuration);

    res
      .status(200)
      .json({ message: `Landing successful, ${airport.airportName}  is now busy` });
  } catch (error) {
    console.error("Error on landing:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkUpdate = async (req, res) => {
  try {
    const airportID = req.params.airportID;
    const airport = await Airport.findOne({ airportID });

    if (!airport) {
      return res.status(404).json({ message: "Airport not found" });
    }

    let isBusy = airport.isBusy;
    let timeRemaining = 0;

    if (isBusy) {
      const currentTime = new Date();
      const busyDuration = 60000; 
      const timePassed = currentTime.getTime() - airport.lastLanding.getTime();

      timeRemaining = busyDuration - timePassed;
      if (timeRemaining < 0) {
        isBusy = false;
        timeRemaining = 0;

        // Update the airport status in the database
        airport.isBusy = false;
        await airport.save();
      } else {
        // Convert timeRemaining to seconds for the response
        timeRemaining = Math.round(timeRemaining / 1000);
      }
    }

    return res.status(200).json({
      isBusy,
      timeRemaining,
    });
  } catch (error) {
    console.error("Error fetching airport status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
