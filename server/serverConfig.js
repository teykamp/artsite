let isProductionServer = true;


module.exports = {
    getIsProdServer: () => {
        return isProductionServer;
    },
    setIsProdServer: (productionServer) => {
        isProductionServer = productionServer;
    },
};


