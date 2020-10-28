const Dogs = artifacts.require('Dogs');
const Proxy = artifacts.require('Proxy');

module.exports = async function(deployer, network, accounts){
    const dogs = await Dogs.new();
    const proxy = await Proxy.new( dogs.address);

    var proxyDog = await Dogs.at(proxy.address);
    await proxyDog.setNumberOfDogs(10);
    var nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log(nrOfDogs.toNumber());

    nrOfDogs = await dogs.getNumberOfDogs();
    console.log(nrOfDogs.toNumber());
}