class ScenarioContext {
    constructor() {
        this.data = {};
    }
    setData(key, value){
        this.data[key] = value;
    }
    getData(key){
        return this.data[key];
    }
    clearData(key){
        delete this.data[key];
    }
}
export const scenarioContext = new ScenarioContext();