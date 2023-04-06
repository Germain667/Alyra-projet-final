// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


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
      	string country;
      	string localisation;
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

    /// @dev Mapping the NFT ID with the owner
    mapping(address => uint256[]) public nftIdAndOwner;  

    /// @dev Mapping the NFT ID with the delegator
    mapping(address => uint256[]) public nftIdAndDelegator;  
	
	/// @dev An event that registers when a user did the KYC for a car
    event Minted (address userAddress, string tokenURI, uint256 nftId, string vin, string brand, string model, string color, uint32 power, string registrationCountry, uint32 registrationDate);

    /// @dev An event when a car is for sale
    event ChangingStatus (string status, address _address, uint256 indexed nftId, uint256 timestamp);

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
        require(msg.sender != address(0), "Empty");
        require(bytes(_tokenURI).length > 0, "Empty");
        require(bytes(_vin).length > 0, "Empty");
        require(bytes(_brand).length > 0, "Empty");
        require(bytes(_model).length > 0, "Empty");
        require(bytes(_color).length > 0, "Empty");
        require(_power > 0, "Empty");
        require(bytes(_registrationCountry).length > 0, "Empty");
        require(_registrationDate > 0, "Empty");

        tokenIds.increment();
        uint256 newItemId = tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        nftIdAndOwner[msg.sender].push(newItemId);
        
        Status memory statusIni = Status(false,false,false,false,false,false);
        InfosForSale memory infosForSaleIni = InfosForSale(0,0,"","","");
		Car memory car = Car(_vin, _brand, _model, _color, _power, _registrationCountry, _registrationDate, "",statusIni, infosForSaleIni);
		nftCarInfos[newItemId] = car;
		emit Minted (msg.sender, _tokenURI, newItemId, _vin, _brand, _model, _color, _power, _registrationCountry, _registrationDate);
        return newItemId;
    }

    function getNftIdsByAddress(address _owner) external view returns (uint256[] memory) {
        return nftIdAndOwner[_owner];
    }

    function getNftIdsByDelegatorAddress(address _owner) external view returns (uint256[] memory) {
        return nftIdAndDelegator[_owner];
    }    

    function getNftIdsByOnSaleAndKycDone(bool _isOnSale, bool _isKycDone) external view returns (uint256[] memory) {
        uint256 itemId = tokenIds.current();
        uint32 count;

       // First, we count the number of cars that match the specified status
        for (uint32 i = 0; i <= itemId; i++) {
            if ((nftCarInfos[i].status.isOnSale == _isOnSale) &&
                (nftCarInfos[i].status.isKycDone == _isKycDone)) {
                count++;
            }
        }

        uint256[] memory Ids = new uint256[](count);
        uint32 index = 0;

        for (uint32 i = 0; i <= itemId; i++) {
            if ((nftCarInfos[i].status.isOnSale == _isOnSale) &&
                (nftCarInfos[i].status.isKycDone == _isKycDone)) {
                Ids[index] = i;
                index++;
            }
        }
        return Ids;
    }

    /**
    * @dev Modifier to check if the address is owner or the delegator of the NFT
    * @param _tokenIds The Id of the NFT 
    */
    modifier isNftOwnerOrDelegator(uint256 _tokenIds) {
        require(ownerOf(_tokenIds)==msg.sender || (getApproved(_tokenIds)==msg.sender &&  nftCarInfos[_tokenIds].status.isDelegated == true) , 'You not authorized');
        require(_tokenIds <= tokenIds.current(), 'id incorrect');
        _;
    }

        /**
    * @dev Modifier to check if the address is owner of the NFT
    * @param _tokenIds The Id of the NFT 
    */
    modifier isNftOwner(uint256 _tokenIds) {
        require(ownerOf(_tokenIds)==msg.sender, 'You not owner');
        require(_tokenIds <= tokenIds.current(), 'id incorrect');
        _;
    }

    /**
    * @dev Change the status of isKycDone to true
    * @param _tokenIds The Id of the NFT 
    */
    function kycIsApproved (uint256 _tokenIds) external onlyOwner {
        require(nftCarInfos[_tokenIds].status.isKycDone == false, 'KYC done');
		nftCarInfos[_tokenIds].status.isWaitingKyc = false;
		nftCarInfos[_tokenIds].status.isKycDone = true;
        emit ChangingStatus("KYC done",msg.sender , _tokenIds, block.timestamp);
    }

    /**
    * @dev Get the NFT informations
    * @param _tokenIds The Id of the NFT 
    */
    function getCarNft (uint256 _tokenIds) external view returns (Car memory) {
        require(_tokenIds <= tokenIds.current(), 'Id incorrect');
        return nftCarInfos[_tokenIds];
    }

    /**
    * @dev Change boolean 'isOnSale' to true, is car is for sale
    * @param _tokenIds The Id of the NFT 
    */
    function carIsForSale (uint256 _tokenIds) internal isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isOnSale = true;
        emit ChangingStatus("Car for sale",msg.sender, _tokenIds, block.timestamp);
    }

    /**
    * @dev Change boolean 'isOnSale' to true, this car is for sale
    * @param _tokenIds The Id of the NFT 
    * @param _mileage the mileage of the car
    * @param _price The price of the car
    * @param _localisation the localisation of the car
    * @param _contactDetails The details of the contact
    */
    function setInformationsForSale (uint256 _tokenIds, uint32 _mileage, uint32 _price, string calldata _country, string calldata _localisation, string calldata _contactDetails) internal isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].infosForSale.mileage = _mileage;
        nftCarInfos[_tokenIds].infosForSale.price = _price;
        nftCarInfos[_tokenIds].infosForSale.country = _country;
        nftCarInfos[_tokenIds].infosForSale.localisation = _localisation;
        nftCarInfos[_tokenIds].infosForSale.contactDetails = _contactDetails;
    }

    function carIsForSaleAndSetInformationsForSale (uint256 _tokenIds, uint32 _mileage, uint32 _price, string calldata _country, string calldata _localisation, string calldata _contactDetails) external isNftOwnerOrDelegator (_tokenIds) {
        require(_mileage > 0, "Empty");
        require(_price > 0, "Empty");
        require(bytes(_country).length > 0, "Empty");
        require(bytes(_localisation).length > 0, "Empty");
        require(bytes(_contactDetails).length > 0, "Empty");
        carIsForSale(_tokenIds);
        setInformationsForSale(_tokenIds, _mileage, _price, _country, _localisation, _contactDetails);
    }

    /**
    * @dev Change boolean 'isStolen' to true, this car is stolen
    * @param _tokenIds The Id of the NFT 
    */
    function carIsStolen (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isStolen = true;
        nftCarInfos[_tokenIds].status.isOnSale = false;
        emit ChangingStatus("Car stolen",msg.sender, _tokenIds, block.timestamp);
    }

    /**
    * @dev Change boolean 'isScrapped' to true, this car is Scrapped
    * @param _tokenIds The Id of the NFT 
    */
    function carIsScrapped (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isScrapped = true;
        nftCarInfos[_tokenIds].status.isOnSale = false;
        emit ChangingStatus("Car scrapped",msg.sender, _tokenIds, block.timestamp);
    }

    /**
    * @dev Change boolean 'isScrapped' to true, this car is Scrapped
    * @param _tokenIds The Id of the NFT 
    */
    function stopSale (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isOnSale = false;
        emit ChangingStatus("Sale stoped",msg.sender, _tokenIds, block.timestamp);
    }

    /**
    * @dev Change boolean 'isScrapped' to true, this car is Scrapped
    * @param _tokenIds The Id of the NFT 
    */
    function carFound (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        nftCarInfos[_tokenIds].status.isStolen = false;
        emit ChangingStatus("Car found",msg.sender, _tokenIds, block.timestamp);
    }

    /**
    * @dev Change boolean 'isDelegated' to true, this car is Delegated
    * @param _tokenIds The Id of the NFT 
    */
    function delegeteCar (address delegatorAddress, uint256 _tokenIds) external isNftOwner (_tokenIds) {
        require(nftCarInfos[_tokenIds].status.isKycDone == true, "The KYC is not approved");
        approve(delegatorAddress, _tokenIds);
        nftIdAndDelegator[delegatorAddress].push(_tokenIds);
        nftCarInfos[_tokenIds].status.isDelegated = true;
        emit ChangingStatus("Car delegated", delegatorAddress, _tokenIds, block.timestamp);
    }

    /**
    * @dev Change boolean 'isDelegated' to false, this car is not delegated anymore
    * @param _tokenIds The Id of the NFT 
    */
    function stopDelegation (uint256 _tokenIds) external isNftOwnerOrDelegator (_tokenIds) {
        require(nftCarInfos[_tokenIds].status.isDelegated == true, "The NFT is not delegated");

        address delegatorAdress = getApproved(_tokenIds);

        nftCarInfos[_tokenIds].status.isDelegated = false;

        if (nftIdAndDelegator[delegatorAdress].length == 1) {
            nftIdAndDelegator[delegatorAdress].pop();
        } else {
            removeTokenIdDelegator(delegatorAdress, _tokenIds);
        }

        emit ChangingStatus("Delegation stoped",msg.sender, _tokenIds, block.timestamp);
    }

    function removeTokenIdDelegator(address _addressToDel, uint256 _tokenIds) internal {
        uint256 length = nftIdAndDelegator[_addressToDel].length;
        for (uint256 i = 0; i < nftIdAndDelegator[_addressToDel].length; i++) {
            if (nftIdAndDelegator[_addressToDel][i] == _tokenIds) {
                // Remplace l'élément à supprimer par le dernier élément du tableau
                nftIdAndDelegator[_addressToDel][i] = nftIdAndDelegator[_addressToDel][length - 1];
                
                // Réduit la longueur du tableau de 1
                nftIdAndDelegator[_addressToDel].pop();
                break;
            }
        }
    }

    /**
    * @dev Change boolean 'isWaitingKyc' to false, this car is not delegated anymore
    * @param _tokenIds The Id of the NFT 
    */
    function askKyc (uint256 _tokenIds) external isNftOwner (_tokenIds) {
        require(nftCarInfos[_tokenIds].status.isKycDone == false, "The KYC is done");
        require(nftCarInfos[_tokenIds].status.isWaitingKyc == false, "The KYC is already waiting");
        nftCarInfos[_tokenIds].status.isWaitingKyc = true;
        emit ChangingStatus("KYC asked",msg.sender, _tokenIds, block.timestamp);
    }

    function removeTokenIdNftOwner(address _addressToDel, uint256 _tokenIds) internal {
        uint256 length = nftIdAndOwner[_addressToDel].length;
        for (uint256 i = 0; i < nftIdAndOwner[_addressToDel].length; i++) {
            if (nftIdAndOwner[_addressToDel][i] == _tokenIds) {
                // Remplace l'élément à supprimer par le dernier élément du tableau
                nftIdAndOwner[_addressToDel][i] = nftIdAndOwner[_addressToDel][length - 1];
                
                // Réduit la longueur du tableau de 1
                nftIdAndOwner[_addressToDel].pop();
                break;
            }
        }
    }

    function addDocumentLink(string memory _newLink, uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId)  {
        string memory currentLink = nftCarInfos[_tokenId].linkDocument;
        if (bytes(currentLink).length == 0) {
            nftCarInfos[_tokenId].linkDocument = _newLink;
        } else {
            nftCarInfos[_tokenId].linkDocument = string(abi.encodePacked(currentLink, ";", _newLink));
        }
        emit ChangingStatus("Document added",msg.sender, _tokenId, block.timestamp);
    }

    function testingAndTransfer (address _from, address _to, uint256 _tokenIds) internal {
        nftCarInfos[_tokenIds].status.isKycDone = false;
        nftCarInfos[_tokenIds].status.isDelegated = false;
        nftCarInfos[_tokenIds].status.isOnSale = false;

        if (nftIdAndOwner[_from].length == 1) {
            nftIdAndOwner[_from].pop();
        } else {
            removeTokenIdNftOwner(_from, _tokenIds);
        }
        nftIdAndOwner[_to].push(_tokenIds);
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
        emit ChangingStatus("transfer",msg.sender, tokenId, block.timestamp);
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
        emit ChangingStatus("transfer",msg.sender, tokenId, block.timestamp);
    }

    function sellNftAndTransferValueToOwner(uint256 _tokenId) external payable  {
        uint256 valueSend               = msg.value;
        address ownerAddress            = ownerOf(_tokenId);
        safeTransferFrom(ownerOf(_tokenId),msg.sender,_tokenId);
        (bool sent, )                   = payable(ownerAddress).call{value: valueSend}("");
        require(sent, unicode"transfer didn't work");
        emit ChangingStatus("transfer with amount",msg.sender, _tokenId, block.timestamp);
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
}
