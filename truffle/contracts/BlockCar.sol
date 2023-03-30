// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "./BlockCarLib.sol";


/**
 * @title BlockCar
 * @author Germain Winckel
 * @notice The blockCar contract code
 * @dev The blockCar contract code
 */
contract BlockCar is ERC721URIStorage, Ownable {
    /**
    * @dev The counter from the openzeppelin contract Counters.sol
    */
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    /**
    * @dev The Status of each NFT, this struct is in the Car struct. When mint, all values are false
    */
    struct Status {
        bool isOnSale;
        bool isDelegated;
        bool isStolen;
        bool isWaitingKyc;
        bool isKycDone;
        bool isScrapped;
    }

    /**
    * @dev Others informations we need for sell the car
    */
    struct InfosForSale {
      	uint32 mileage;
      	uint32 price;
      	uint32 localisation;
      	string contactDetails;
    }

    /**
    * @dev A complex type that all the statics informations of a NFT. 
	* linkDocument contains all the link to the differents documents, the separtoir is ;
    */
	struct Car{
		string vin;
		string brand;
		string model;
      	string color;
      	uint32 power; //kw
      	string registrationCountry;
      	uint32 registrationDate;    // dd/mm/yyyy
      	string linkDocument;        //only value which can change
      	Status status;
        InfosForSale infosForSale;
	}
    
	/// @dev Mapping the NFT ID with the car informations
    mapping(uint256 => Car) nftCarInfos;

    /// @dev Mapping the NFT ID with informations for sale
    mapping(address => uint256[]) public nftIdAndOwner;  

    /// @dev Mapping the NFT ID with informations for sale
    //mapping(uint256 => address) delegatorList;

	/// @dev An event when a user did the KYC for a car
    event KycIsDone (uint256 nftId);

    /// @dev An event when a user did is waiting for the KYC
    event KycIsWaiting (address _address, uint256 nftId);
	
	/// @dev An event that registers when a user did the KYC for a car
    event Minted (address userAddress, string tokenURI, uint256 nftId, string vin, string brand, string model, string color, uint32 power, string registrationCountry, uint32 registrationDate);

    /// @dev An event when a car is for sale
    event CarForSale (address _address, uint256 nftId);

    /// @dev An event when a the car sell is delegated          // not sure we need this event
    //event CarIsDelegated (address _addressOwner, address delegatedAddress, uint256 nftId);

    /// @dev An event when a the car sell saled                 // not sure we need this event
    //event CarIsSaled (address _oldAddressOwner, address _newAddressOwner, uint256 nftId);

    /// @dev An event when the car is Scrapped
    event CarIsScrapped (address _address, uint256 nftId);

    /// @dev An event when the car is Stolen
    event CarIsStolen (address _address, uint256 nftId);

    /// @dev An event when the car informations are updated for sale
    event CarInfosIsUpdatedForSale (address _address, uint256 nftId);

    /// @dev An event when the car informations are updated for sale
    event CarStatusReinitForSale (address _address, uint256 nftId);

    /// @dev An event when the car informations are updated for sale
    event StopDelegation (address _address, uint256 nftId);

    /// @dev An event when a deposit is received
    event LogDepositReceived (address _address);

    constructor() ERC721 ("BlockCar", "BLC") {
    }

	/**
     * @dev To mint an NFT
	 * @param _tokenURI : Link to jdon/image
	 * @param _vin : Vehicle Identification Number
	 * @param _brand : Brand of the car
	 * @param _model : Model of the car
	 * @param _color : color of the car
	 * @param _power : Power of the car in Kw
	 * @param _registrationCountry : Reistration country
	 * @param _registrationDate : Regisytration date in ddmmyyyy
     * @return newItemId mThe Id of the NFT 
     */
    function mintCar(string memory _tokenURI, string memory _vin, string memory _brand, string memory _model, string memory _color, uint32 _power, string memory _registrationCountry, uint32 _registrationDate) public returns (uint256) {
        require(msg.sender != address(0), "Invalid address");
        require(bytes(_tokenURI).length > 0, "Invalid token URI");
        require(bytes(_vin).length > 0, "Invalid VIN");
        require(bytes(_brand).length > 0, "Invalid brand");
        require(bytes(_model).length > 0, "Invalid mod0el");
        require(bytes(_color).length > 0, "Invalid color");
        require(_power > 0, "Invalid power");
        require(bytes(_registrationCountry).length > 0, "Invalid registration country");
        require(_registrationDate > 0, "Invalid registration date");

        tokenIds.increment();
        uint256 newItemId = tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        nftIdAndOwner[msg.sender].push(newItemId);
        
        Status memory statusIni = Status(false,false,false,false,false,false);
        InfosForSale memory infosForSaleIni = InfosForSale(0,0,0,"");
		Car memory car = Car(_vin, _brand, _model, _color, _power, _registrationCountry, _registrationDate, "",statusIni, infosForSaleIni);
		nftCarInfos[newItemId] = car;
		emit Minted (msg.sender, _tokenURI, newItemId, _vin, _brand, _model, _color, _power, _registrationCountry, _registrationDate);
        return newItemId;
    }

    /**
    * @dev Modifier to check if the address is owner or the delegator of the NFT
    * @param _tokenIds The Id of the NFT 
    */
    modifier isNftOwnerOrDelegator(uint256 _tokenIds) {
        require(ownerOf(_tokenIds)==msg.sender || (getApproved(_tokenIds)==msg.sender &&  nftCarInfos[_tokenIds].status.isDelegated == true) , 'You are not authorized');
        require(_tokenIds <= tokenIds.current(), 'The NFT id is not correct');
        _;
    }

        /**
    * @dev Modifier to check if the address is owner of the NFT
    * @param _tokenIds The Id of the NFT 
    */
    modifier isNftOwner(uint256 _tokenIds) {
        require(ownerOf(_tokenIds)==msg.sender, 'You are not the owner');
        require(_tokenIds <= tokenIds.current(), 'The NFT id is not correct');
        _;
    }

    /**
    * @dev Change the status of isKycDone to true
    * @param _tokenIds The Id of the NFT 
    */
    function kycIsApproved (uint256 _tokenIds) external onlyOwner {
        require(nftCarInfos[_tokenIds].status.isKycDone == false, 'KYC is already done');
		nftCarInfos[_tokenIds].status.isWaitingKyc = false;
		nftCarInfos[_tokenIds].status.isKycDone = true;
		emit KycIsDone(_tokenIds);
    }

    /**
    * @dev Get the NFT informations
    * @param _tokenIds The Id of the NFT 
    */
    function getCarNft (uint256 _tokenIds) external view returns (Car memory) {
        require(_tokenIds <= tokenIds.current(), 'The NFT id is not correct');
        return nftCarInfos[_tokenIds];
    }

    /**
    * @dev Change boolean 'isOnSale' to true, is car is for sale
    * @param _tokenIds The Id of the NFT 
    */
    function carIsForSale (uint256 _tokenIds) internal isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isOnSale = true;
        emit CarForSale (msg.sender, _tokenIds);
    }

    /**
    * @dev Change boolean 'isOnSale' to true, this car is for sale
    * @param _tokenIds The Id of the NFT 
    * @param _mileage the mileage of the car
    * @param _price The price of the car
    * @param _localisation the localisation of the car
    * @param _contactDetails The details of the contact
    */
    function setInformationsForSale (uint256 _tokenIds, uint32 _mileage, uint32 _price, uint32 _localisation, string calldata _contactDetails) internal isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].infosForSale.mileage = _mileage;
        nftCarInfos[_tokenIds].infosForSale.price = _price;
        nftCarInfos[_tokenIds].infosForSale.localisation = _localisation;
        nftCarInfos[_tokenIds].infosForSale.contactDetails = _contactDetails;
        emit CarInfosIsUpdatedForSale (msg.sender, _tokenIds);
    }

    function carIsForSaleAndSetInformationsForSale (uint256 _tokenIds, uint32 _mileage, uint32 _price, uint32 _localisation, string calldata _contactDetails) external isNftOwnerOrDelegator (_tokenIds) {
        require(_mileage > 0, "The mileage can be 0");
        require(_price > 0, "There is no price");
        require(_localisation > 0, "The power is not indicated");
        require(bytes(_contactDetails).length > 0, "Invalid color");
        carIsForSale(_tokenIds);
        setInformationsForSale(_tokenIds, _mileage, _price, _localisation, _contactDetails);
    }

    /**
    * @dev Change boolean 'isStolen' to true, this car is stolen
    * @param _tokenIds The Id of the NFT 
    */
    function carIsStolen (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isStolen = true;
        nftCarInfos[_tokenIds].status.isOnSale = false;
        emit CarIsStolen (msg.sender, _tokenIds);
    }

    /**
    * @dev Change boolean 'isScrapped' to true, this car is Scrapped
    * @param _tokenIds The Id of the NFT 
    */
    function carIsScrapped (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isScrapped = true;
        nftCarInfos[_tokenIds].status.isOnSale = false;
        emit CarIsScrapped(msg.sender, _tokenIds);
    }

        /**
    * @dev Change boolean 'isScrapped' to true, this car is Scrapped
    * @param _tokenIds The Id of the NFT 
    */
    function reinitStatusForSelling (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isScrapped = false;
        nftCarInfos[_tokenIds].status.isStolen = false;
        nftCarInfos[_tokenIds].status.isOnSale = true;
        emit CarStatusReinitForSale(msg.sender, _tokenIds);
    }

    /**
    * @dev Change boolean 'isDelegated' to true, this car is Delegated
    * @param _tokenIds The Id of the NFT 
    */
    function delegeteCar (address delegatorAddress, uint256 _tokenIds) external isNftOwner (_tokenIds) {
        require(nftCarInfos[_tokenIds].status.isKycDone == true, "The KYC is not approved");
        approve(delegatorAddress, _tokenIds);
        nftCarInfos[_tokenIds].status.isDelegated = true;
        //emit CarIsDelegated(msg.sender, delegatorAddress, _tokenIds);
    }

    /**
    * @dev Change boolean 'isDelegated' to false, this car is not delegated anymore
    * @param _tokenIds The Id of the NFT 
    */
    function stopDelegation (uint256 _tokenIds) external isNftOwner (_tokenIds) {
        require(nftCarInfos[_tokenIds].status.isDelegated == true, "The NFT is not delegated");
        nftCarInfos[_tokenIds].status.isDelegated = false;
        emit StopDelegation(msg.sender, _tokenIds);
    }

    /**
    * @dev Change boolean 'isWaitingKyc' to false, this car is not delegated anymore
    * @param _tokenIds The Id of the NFT 
    */
    function askKyc (uint256 _tokenIds) external isNftOwner (_tokenIds) {
        require(nftCarInfos[_tokenIds].status.isKycDone == true, "The KYC is done");
        require(nftCarInfos[_tokenIds].status.isWaitingKyc == true, "The KYC is already waiting");
        nftCarInfos[_tokenIds].status.isWaitingKyc = true;
        emit KycIsWaiting(msg.sender, _tokenIds);
    }

    function testingAndTransfer (address _from, address _to, uint256 _tokenIds) internal isNftOwnerOrDelegator (_tokenIds)  {
        nftCarInfos[_tokenIds].status.isKycDone = false;
        nftCarInfos[_tokenIds].status.isDelegated = false;
        nftCarInfos[_tokenIds].status.isOnSale = false;
        delete (nftIdAndOwner[_from][_tokenIds]);
        nftIdAndOwner[_to].push(_tokenIds);

    }

    function addDocumentLink(string memory _newLink, uint256 _tokenIds) internal isNftOwnerOrDelegator (_tokenIds)  {
        string memory currentLink = nftCarInfos[_tokenIds].linkDocument;
        if (bytes(currentLink).length == 0) {
            nftCarInfos[_tokenIds].linkDocument = _newLink;
        } else {
            nftCarInfos[_tokenIds].linkDocument = string(abi.encodePacked(currentLink, ";", _newLink));
        }
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        testingAndTransfer(from, to, tokenId);
        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        testingAndTransfer(from, to, tokenId);
        _safeTransfer(from, to, tokenId, data);
    }

    function sellNftAndTransferValueToOwner(uint256 _tokenIds) external payable  {
        uint256 valueSend               = msg.value;
        address ownerAddress            = ownerOf(_tokenIds);
        safeTransferFrom(ownerOf(_tokenIds),msg.sender,_tokenIds);
        (bool sent, )                   = payable(ownerAddress).call{value: valueSend}("");
        require(sent, unicode"transfer didn't work");
    }

    function sellNftAndTransferValueToOwnerAndDelegator(uint256 _tokenIds) external payable  {
        uint256 valueSendForOwner       = (msg.value*9)/10;
        uint256 valueSendForDelegator   = msg.value/10;
        address ownerAddress            = ownerOf(_tokenIds);
        address delegatorAddress        = getApproved(_tokenIds);

        safeTransferFrom(ownerOf(_tokenIds),msg.sender,_tokenIds);

        (bool sent1, )                   = payable(ownerAddress).call{value: valueSendForOwner}("");
        require(sent1, unicode"transfer didn't work");
        
        (bool sent2, )                   = payable(delegatorAddress).call{value: valueSendForDelegator}("");
        require(sent2, unicode"transfer didn't work");
    
    }


    fallback() external payable { 
        require(msg.data.length == 0);
        emit LogDepositReceived(msg.sender); 
    }
 
    receive() external payable { 
        emit LogDepositReceived(msg.sender); 
    }

    function withdrawal() public onlyOwner {
        require(address(this).balance >= 1, "You need at least 1 ETH to withdraw");
        (bool sent, )                   = payable(msg.sender).call{value: address(this).balance}("");
        require(sent, unicode"transfer didn't work");
    }
    //add others documents
}
