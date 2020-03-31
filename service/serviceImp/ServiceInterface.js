
class ServiceInterface{

    constructor() {
        if(!this.execute) {
            throw new Error(" execute not implemented ");
        }
    }
}
module.exports = {
    ServiceInterface:ServiceInterface
};
