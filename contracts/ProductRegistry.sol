// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string title;          // Artwork title
        string artist;         // Artist name
        string size;           // Artwork size
        // Removed price field
    }

    Product[] public products; // Array to store products
    mapping(address => uint256[]) public ownerProductIndices; // Mapping to track products by owner

    event ProductAdded(uint256 indexed productId, string title);
    event FundsWithdrawn(address indexed admin, uint256 amount);

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Modified function without price parameter
    function addProduct(
        string memory _title,
        string memory _artist,
        string memory _size
    ) public payable {
        require(msg.value > 0, "Payment required to register artwork");

        // Create new product without price field
        uint256 newProductId = products.length;
        Product memory newProduct = Product({
            title: _title,
            artist: _artist,
            size: _size
        });

        // Add product to array
        products.push(newProduct);

        // Still track product indices for the sender (for retrieval purposes)
        ownerProductIndices[msg.sender].push(newProductId);

        emit ProductAdded(newProductId, _title);
    }

    // Get total number of products
    function getTotalProducts() public view returns (uint256) {
        return products.length;
    }

    // Get products owned by a specific address
    function getProductsByOwner(address _owner) public view returns (Product[] memory) {
        uint256[] memory indices = ownerProductIndices[_owner];
        Product[] memory ownerProducts = new Product[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            ownerProducts[i] = products[indices[i]];
        }

        return ownerProducts;
    }

    // Get all products (with pagination to avoid gas limit)
    function getProductsPaginated(uint256 _start, uint256 _count) public view returns (Product[] memory) {
        require(_start < products.length, "Invalid start index");
        
        uint256 count = _count;
        if (_start + _count > products.length) {
            count = products.length - _start;
        }

        Product[] memory paginatedProducts = new Product[](count);
        for (uint256 i = 0; i < count; i++) {
            paginatedProducts[i] = products[_start + i];
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