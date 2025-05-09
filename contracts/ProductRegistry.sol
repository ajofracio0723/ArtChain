// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string title;          // Artwork title
        string description;    // Artwork description
        string artist;         // Artist name
        string size;           // Artwork size
        string medium;         // Artwork medium
        uint16 yearCreated;    // Year artwork was created
        address owner;         // Owner of the artwork
        bool exists;           // To check if product exists
    }

    uint256 public productCount = 0; // Counter for product IDs
    mapping(uint256 => Product) public products; // Mapping from ID to product
    mapping(address => uint256[]) public ownerProductIds; // Mapping to track products by owner

    event ProductAdded(uint256 indexed productId, address indexed owner, string title);
    event FundsWithdrawn(address indexed admin, uint256 amount);

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Modified function to use mappings
    function addProduct(
        string memory _title,
        string memory _description,
        string memory _artist,
        string memory _size,
        string memory _medium,
        uint16 _yearCreated
    ) public payable {
        require(msg.value > 0, "Payment required to register artwork");

        // Create new product with unique ID
        uint256 newProductId = productCount;
        
        // Store product in mapping
        products[newProductId] = Product({
            title: _title,
            description: _description,
            artist: _artist,
            size: _size,
            medium: _medium,
            yearCreated: _yearCreated,
            owner: msg.sender,
            exists: true
        });

        // Track product IDs for the sender
        ownerProductIds[msg.sender].push(newProductId);

        // Increment product count
        productCount++;

        emit ProductAdded(newProductId, msg.sender, _title);
    }

    // Get total number of products
    function getTotalProducts() public view returns (uint256) {
        return productCount;
    }

    // Get product by ID
    function getProductById(uint256 _productId) public view returns (Product memory) {
        require(_productId < productCount, "Product does not exist");
        require(products[_productId].exists, "Product has been deleted");
        return products[_productId];
    }

    // Get products owned by a specific address
    function getProductsByOwner(address _owner) public view returns (Product[] memory) {
        uint256[] memory ids = ownerProductIds[_owner];
        Product[] memory ownerProducts = new Product[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            ownerProducts[i] = products[ids[i]];
        }

        return ownerProducts;
    }

    // Get products with pagination
    function getProductsPaginated(uint256 _start, uint256 _count) public view returns (Product[] memory) {
        require(_start < productCount, "Invalid start index");
        
        uint256 count = _count;
        if (_start + _count > productCount) {
            count = productCount - _start;
        }

        Product[] memory paginatedProducts = new Product[](count);
        for (uint256 i = 0; i < count; i++) {
            uint256 productId = _start + i;
            if (products[productId].exists) {
                paginatedProducts[i] = products[productId];
            }
        }

        return paginatedProducts;
    }

    // Accepts payments to the contract
    receive() external payable {}

    // Admin function to withdraw funds from the contract
    function withdraw(uint256 _amount) public onlyAdmin {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(admin).transfer(_amount);
        emit FundsWithdrawn(admin, _amount);
    }

    // Function to check the contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}