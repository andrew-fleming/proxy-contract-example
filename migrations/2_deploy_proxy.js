const Dogs = artifacts.require('Dogs');
const DogsUpdated = artifacts.require('DogsUpdated');
const Proxy = artifacts.require('Proxy');

module.exports = async function(deployer, network, accounts){
    //deploy contracts
    const dogs = await Dogs.new();
    const proxy = await Proxy.new( dogs.address);

    //create Proxy Dog to fool Truffle
    var proxyDog = await Dogs.at(proxy.address);

    //set the number of dogs through proxy
    await proxyDog.setNumberOfDogs(10);

    //testing
    var nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log("before update: " + nrOfDogs.toNumber());

    //deploying new contract while keeping the storage
    const dogsUpdated = await DogsUpdated.new();
    proxy.upgrade(dogsUpdated.address);

    //fool truffle, again. It now thinks proxyDog has all functions
    proxyDog = await DogsUpdated.at(proxy.address);

    //initialize proxy state
    proxyDog.initialize(accounts[0]);

    //checking that storage remains
    nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log("after update: " + nrOfDogs.toNumber());

    //set the number of dogs through proxy with new func contract with owner func set
    await proxyDog.setNumberOfDogs(30);
    
    //checking storage remains after new func contract
    nrOfDogs = await proxyDog.getNumberOfDogs();
    console.log("after update2: " + nrOfDogs.toNumber());
}