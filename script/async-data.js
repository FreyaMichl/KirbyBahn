export default class AsyncData {

    load(result) {
        this.result = result;
    }

    isLoaded() {
        return !!this.result;
    }

}