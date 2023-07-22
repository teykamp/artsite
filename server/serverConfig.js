const mongoose = require('mongoose');


// This will get overridden during testing
let connectFunction = async (app, port) => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Production MongoDB connected...'))
    .catch(err => console.log(err));

    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
}



module.exports = {
    // Only called during testing to allow test code to use in-memory db rather than production copy
    setConnectFunction: (connFunction) => {
        connectFunction = connFunction;
    },

    connectToDatabase: async (app, port) => {
        await connectFunction(app, port);
    },
};


