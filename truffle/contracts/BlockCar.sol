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
    * @dev Others informations we need to sell the car
    */
    struct InfosForSale {
      	uint32 mileage;
      	uint256 price;
      	string country;
      	string localisation;
      	string contactDetails;
    }

    /**
    * @dev A complex type with all the statics informations of a NFT. 
	* linkDocument contains all the link to the differents documents, the separtoir is ";" only value which can change
    */
	struct Car{
		string vin;
		string brand;
		string model;
      	string color;
      	uint32 power; //kw
      	string registrationCountry;
      	uint32 registrationDate;    // dd/mm/yyyy
      	string linkDocument;        
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
     * @return newItemId The Id of the NFT 
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

    /**
    * @dev Returns the current value of the tokenIds counter, which represents the number of tokens minted so far.
    * @return current value of the tokenIds counter.
    */
    function getCurrentId() external view returns(uint256) {
        return tokenIds.current();
    }

    /**
    * @dev Returns an array of NFT IDs owned by the specified address.
    * @param _owner The address to retrieve NFT IDs for.
    * @return nftIdAndOwner[] array of NFT IDs.
    */
    function getNftIdsByAddress(address _owner) external view returns (uint256[] memory) {
        return nftIdAndOwner[_owner];
    }

    /**
    * @dev Returns an array of NFT IDs owned by a delelegator address.
    * @param _owner The address to retrieve NFT IDs for.
    * @return nftIdAndDelegator[] array of NFT IDs.
    */
    function getNftIdsByDelegatorAddress(address _owner) external view returns (uint256[] memory) {
        return nftIdAndDelegator[_owner];
    }    

    /**
    * @dev Returns an array of NFT of all NFT which have status isOnSale to true
    * @return Ids[] array of NFT IDs.
    */
    function getNftIdsByOnSaleAndKycDone() external view returns (uint256[] memory) {
        uint256 itemId = tokenIds.current();
        uint32 count;

       // First, we count the number of cars that match the specified status
        for (uint32 i = 0; i <= itemId; i++) {
            if ((nftCarInfos[i].status.isOnSale == true)) {
                count++;
            }
        }

        uint256[] memory Ids = new uint256[](count);
        uint32 index = 0;

        for (uint32 i = 0; i <= itemId; i++) {
            if ((nftCarInfos[i].status.isOnSale == true)) {
                Ids[index] = i;
                index++;
            }
        }
        return Ids;
    }

    /**
    * @dev Modifier to check if the address is owner or the delegator of the NFT
    * @param _tokenId The Id of the NFT 
    */
    modifier isNftOwnerOrDelegator(uint256 _tokenId) {
        require(_tokenId <= tokenIds.current(), 'Id incorrect');
        require(nftCarInfos[_tokenId].status.isKycDone == true, "KYC not approved");
        require(ownerOf(_tokenId)==msg.sender || (getApproved(_tokenId)==msg.sender &&  nftCarInfos[_tokenId].status.isDelegated == true) , 'You not authorized');
        _;
    }

    /**
    * @dev Modifier to check if the address is owner of the NFT
    * @param _tokenId The Id of the NFT 
    */
    modifier isNftOwner(uint256 _tokenId) {
        require(_tokenId <= tokenIds.current(), 'Id incorrect');
        require(ownerOf(_tokenId)==msg.sender, 'You not owner');
        _;
    }

    /**
    * @dev Get the NFT informations
    * @param _tokenId The Id of the NFT 
    * @return nftCarInfos struct.
    */
    function getCarNft (uint256 _tokenId) external view returns (Car memory) {
        require(_tokenId <= tokenIds.current(), 'Id incorrect');
        return nftCarInfos[_tokenId];
    }

    /**
    * @dev Change boolean 'isWaitingKyc' to false, the admnin has to approve now
    * @param _tokenId The Id of the NFT 
    */
    function askKyc (uint256 _tokenId) external isNftOwner (_tokenId) {
        require(nftCarInfos[_tokenId].status.isKycDone == false, "KYC is done");
        require(nftCarInfos[_tokenId].status.isWaitingKyc == false, "KYC already waiting");
        nftCarInfos[_tokenId].status.isWaitingKyc = true;
        emit ChangingStatus("KYC asked",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Change the status of isKycDone to true, so the KYC is done
    * @param _tokenId The Id of the NFT 
    */
    function kycIsApproved (uint256 _tokenId) external onlyOwner {
        require(nftCarInfos[_tokenId].status.isKycDone == false, 'KYC done');
		nftCarInfos[_tokenId].status.isWaitingKyc = false;
		nftCarInfos[_tokenId].status.isKycDone = true;
        emit ChangingStatus("KYC done",msg.sender , _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isOnSale' to true, this car is for sale
    * @param _tokenId The Id of the NFT 
    * @param _mileage the mileage of the car
    * @param _price The price of the car
    * @param _localisation the localisation of the car
    * @param _contactDetails The details of the contact
    */
    function carIsForSale (uint256 _tokenId, uint32 _mileage, uint32 _price, string calldata _country, string calldata _localisation, string calldata _contactDetails) external isNftOwnerOrDelegator (_tokenId) {
        require(_mileage > 0, "Empty");
        require(_price > 0, "Empty");
        require(bytes(_country).length > 0, "Empty");
        require(bytes(_localisation).length > 0, "Empty");
        require(bytes(_contactDetails).length > 0, "Empty");
        nftCarInfos[_tokenId].infosForSale.mileage = _mileage;
        nftCarInfos[_tokenId].infosForSale.price = _price;
        nftCarInfos[_tokenId].infosForSale.country = _country;
        nftCarInfos[_tokenId].infosForSale.localisation = _localisation;
        nftCarInfos[_tokenId].infosForSale.contactDetails = _contactDetails;
        nftCarInfos[_tokenId].status.isOnSale = true;
        emit ChangingStatus("Car for sale",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isOnSale' to false, the sale is canceled
    * @param _tokenId The Id of the NFT 
    */
    function stopSale (uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId) {
        nftCarInfos[_tokenId].status.isOnSale = false;
        emit ChangingStatus("Sale stoped",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isStolen' to true, this car is stolen
    * @param _tokenId The Id of the NFT 
    */
    function carIsStolen (uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId) {
        nftCarInfos[_tokenId].status.isStolen = true;
        nftCarInfos[_tokenId].status.isOnSale = false;
        emit ChangingStatus("Car stolen",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isStolen' to true, the car was found
    * @param _tokenId The Id of the NFT 
    */
    function carFound (uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId) {
        nftCarInfos[_tokenId].status.isStolen = false;
        emit ChangingStatus("Car found",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isScrapped' to true, this car is Scrapped
    * @param _tokenId The Id of the NFT 
    */
    function carIsScrapped (uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId) {
        nftCarInfos[_tokenId].status.isScrapped = true;
        nftCarInfos[_tokenId].status.isOnSale = false;
        emit ChangingStatus("Car scrapped",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isDelegated' to true, this car is Delegated
    * @param delegatorAddress delegator address
    * @param _tokenId The Id of the NFT 
    */
    function delegeteCar (address delegatorAddress, uint256 _tokenId) external isNftOwner (_tokenId) {
        require(nftCarInfos[_tokenId].status.isKycDone == true, "KYC not approved");
        approve(delegatorAddress, _tokenId);
        nftIdAndDelegator[delegatorAddress].push(_tokenId);
        nftCarInfos[_tokenId].status.isDelegated = true;
        emit ChangingStatus("Car delegated", delegatorAddress, _tokenId, block.timestamp);
    }

    /**
    * @dev Change boolean 'isDelegated' to false, this car is not delegated anymore
    * @param _tokenId The Id of the NFT 
    */
    function stopDelegation (uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId) {
        require(nftCarInfos[_tokenId].status.isDelegated == true, "NFT not delegated");
        deleteDelegation(_tokenId);
        emit ChangingStatus("Delegation stoped",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev Delete the delegation of an NFT and remove it from the delegator's list of NFTs.
    * @param _tokenId The ID of the NFT
    * @notice This function is private and it is called by testingAndTransfer and deleteDelegation
    */
    function deleteDelegation (uint256 _tokenId) private {
        address delegatorAdress = getApproved(_tokenId);
        nftCarInfos[_tokenId].status.isDelegated = false;
        if (nftIdAndDelegator[delegatorAdress].length == 1) {
            nftIdAndDelegator[delegatorAdress].pop();
        } else {
            uint256 length = nftIdAndDelegator[delegatorAdress].length;
            for (uint256 i = 0; i < nftIdAndDelegator[delegatorAdress].length; i++) {
                if (nftIdAndDelegator[delegatorAdress][i] == _tokenId) {
                    nftIdAndDelegator[delegatorAdress][i] = nftIdAndDelegator[delegatorAdress][length - 1];
                    nftIdAndDelegator[delegatorAdress].pop();
                    break;
                }
            }
        }
    }

    /**
    * @dev add a link to linkDocument in the same field. The separator is ";"
    * @param _tokenId The ID of the NFT
    * @param _newLink new link
    */
    function addDocumentLink(string memory _newLink, uint256 _tokenId) external isNftOwnerOrDelegator (_tokenId)  {
        require(bytes(_newLink).length > 0, "Empty");
        string memory currentLink = nftCarInfos[_tokenId].linkDocument;
        if (bytes(currentLink).length == 0) {
            nftCarInfos[_tokenId].linkDocument = _newLink;
        } else {
            nftCarInfos[_tokenId].linkDocument = string(abi.encodePacked(currentLink, ";", _newLink));
        }
        emit ChangingStatus("Document added",msg.sender, _tokenId, block.timestamp);
    }

    /**
    * @dev testing, changing the status and delete the owner address in nftCarInfos and the delegator address in nftIdAndDelegator (before transfer)
    * @param _from old owner address
    * @param _to old owner address
    * @param tokenId The ID of the NFT
    */
    function testingAndTransfer (address _from, address _to, uint256 tokenId) private {
        require(nftCarInfos[tokenId].status.isKycDone == true, "KYC not approved");
        nftCarInfos[tokenId].status.isKycDone = false;
        nftCarInfos[tokenId].status.isDelegated = false;
        nftCarInfos[tokenId].status.isOnSale = false;

        deleteDelegation(tokenId);

        if (nftIdAndOwner[_from].length == 1) {
            nftIdAndOwner[_from].pop();
        } else {
            uint256 length = nftIdAndOwner[_from].length;
            for (uint256 i = 0; i < nftIdAndOwner[_from].length; i++) {
                if (nftIdAndOwner[_from][i] == tokenId) {
                    // Remplace l'élément à supprimer par le dernier élément du tableau
                    nftIdAndOwner[_from][i] = nftIdAndOwner[_from][length - 1];
                    // Réduit la longueur du tableau de 1
                    nftIdAndOwner[_from].pop();
                    break;
                }
            }
        }
        nftIdAndOwner[_to].push(tokenId);
    }

    /**
    * @dev override ERC721, transfer NFT
    * @param from old owner address
    * @param to old owner address
    * @param tokenId The ID of the NFT
    */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        testingAndTransfer(from, to, tokenId);
        _transfer(from, to, tokenId);
        emit ChangingStatus("transfer",msg.sender, tokenId, block.timestamp);
    }

    /**
    * @dev override ERC721, transfer NFT
    * @param from old owner address
    * @param to old owner address
    * @param tokenId The ID of the NFT
    */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
    * @dev override ERC721, transfer NFT
    * @param from old owner address
    * @param to old owner address
    * @param tokenId The ID of the NFT
    * @param data some dataq
    */
    function safeTransferFrom (
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        testingAndTransfer(from, to, tokenId);
        _safeTransfer(from, to, tokenId, data);
        emit ChangingStatus("transfer",msg.sender, tokenId, block.timestamp);
    }

    /**
    * @dev buy function when the nft is in sale
    * @param _tokenId The ID of the NFT
    */
    function buyNftAndTransferValue(uint256 _tokenId) external payable  {
        require(nftCarInfos[_tokenId].status.isOnSale == true, "NFT not in sale");
        require(nftCarInfos[_tokenId].infosForSale.price <= msg.value, "Amount not good");

        uint256 valueSend               = msg.value;
        address ownerAddress            = ownerOf(_tokenId);
        testingAndTransfer(ownerAddress, msg.sender, _tokenId);
        _safeTransfer(ownerAddress, msg.sender, _tokenId, "");
        (bool sent, )                   = payable(ownerAddress).call{value: valueSend}("");
        require(sent, unicode"transfer didn't work");
        emit ChangingStatus("transfer with value",msg.sender, _tokenId, block.timestamp);
    }
}
