let helloWorld = function () {
    return 'Hello world!';
};

describe('Hello world', function () {
    it('says hello', function () {
        expect(helloWorld()).toEqual('Hello world!');
    });
});
