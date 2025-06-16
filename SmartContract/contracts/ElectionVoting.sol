// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title VotingDApp
 * @dev Smart contract for managing decentralized voting on Conflux eSpace Testnet
 */
contract VotingDApp {
    // Contract owner
    address public owner;
    
    // Counter for election IDs
    uint256 public electionCount;
    
    // Structure for a candidate
    struct Candidate {
        uint256 id;
        string name;
        string info;
        uint256 voteCount;
    }
    
    // Structure for an election
    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 candidateCount;
        address creator;
    }
    
    // Mapping of election ID to Election
    mapping(uint256 => Election) public elections;
    
    // Mapping of election ID to candidate ID to Candidate
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    
    // Mapping of election ID to voter address to whether they have voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Mapping of election ID to voter address to whitelist status (if whitelist is enabled)
    mapping(uint256 => mapping(address => bool)) public voterWhitelist;
    
    // Mapping of election ID to whether whitelist is enabled
    mapping(uint256 => bool) public whitelistEnabled;
    
    // Events
    event ElectionCreated(uint256 indexed electionId, string title, address creator);
    event CandidateAdded(uint256 indexed electionId, uint256 candidateId, string name);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 candidateId);
    event ElectionStatusChanged(uint256 indexed electionId, bool active);
    event VoterWhitelisted(uint256 indexed electionId, address voter);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyElectionCreator(uint256 _electionId) {
        require(elections[_electionId].creator == msg.sender, "Only election creator can call this function");
        _;
    }
    
    modifier electionExists(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 _electionId) {
        require(elections[_electionId].active, "Election is not active");
        require(block.timestamp >= elections[_electionId].startTime, "Election has not started yet");
        require(block.timestamp <= elections[_electionId].endTime, "Election has ended");
        _;
    }
    
    modifier hasNotVoted(uint256 _electionId) {
        require(!hasVoted[_electionId][msg.sender], "You have already voted in this election");
        _;
    }
    
    modifier isWhitelisted(uint256 _electionId) {
        if (whitelistEnabled[_electionId]) {
            require(voterWhitelist[_electionId][msg.sender], "You are not whitelisted for this election");
        }
        _;
    }
    
    /**
     * @dev Contract constructor
     */
    constructor() {
        owner = msg.sender;
        electionCount = 0;
    }
    
    /**
     * @dev Gets the current blockchain timestamp
     * @return The current block timestamp
     */
    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }
    
    /**
     * @dev Creates a new election
     * @param _title Title of the election
     * @param _description Description of the election
     * @param _startTime Start time of the election (Unix timestamp)
     * @param _endTime End time of the election (Unix timestamp)
     * @param _enableWhitelist Whether to enable whitelist for this election
     * @return The ID of the newly created election
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        bool _enableWhitelist
    ) public returns (uint256) {
        require(_startTime >= block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        
        electionCount++;
        uint256 electionId = electionCount;
        
        elections[electionId] = Election({
            id: electionId,
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            active: true,
            candidateCount: 0,
            creator: msg.sender
        });
        
        whitelistEnabled[electionId] = _enableWhitelist;
        
        emit ElectionCreated(electionId, _title, msg.sender);
        
        return electionId;
    }
    
    /**
     * @dev Adds a candidate to an election
     * @param _electionId ID of the election
     * @param _name Name of the candidate
     * @param _info Additional information about the candidate
     * @return The ID of the newly added candidate
     */
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _info
    ) public onlyElectionCreator(_electionId) electionExists(_electionId) returns (uint256) {
        require(block.timestamp < elections[_electionId].startTime, "Cannot add candidates after election has started");
        
        elections[_electionId].candidateCount++;
        uint256 candidateId = elections[_electionId].candidateCount;
        
        candidates[_electionId][candidateId] = Candidate({
            id: candidateId,
            name: _name,
            info: _info,
            voteCount: 0
        });
        
        emit CandidateAdded(_electionId, candidateId, _name);
        
        return candidateId;
    }
    
    /**
     * @dev Casts a vote in an election
     * @param _electionId ID of the election
     * @param _candidateId ID of the candidate
     */
    function castVote(
        uint256 _electionId, 
        uint256 _candidateId
    ) public electionExists(_electionId) electionActive(_electionId) hasNotVoted(_electionId) isWhitelisted(_electionId) {
        require(_candidateId > 0 && _candidateId <= elections[_electionId].candidateCount, "Invalid candidate ID");
        
        candidates[_electionId][_candidateId].voteCount++;
        hasVoted[_electionId][msg.sender] = true;
        
        emit VoteCast(_electionId, msg.sender, _candidateId);
    }
    
    /**
     * @dev Changes the status of an election
     * @param _electionId ID of the election
     * @param _active New status of the election
     */
    function setElectionStatus(
        uint256 _electionId, 
        bool _active
    ) public onlyElectionCreator(_electionId) electionExists(_electionId) {
        elections[_electionId].active = _active;
        
        emit ElectionStatusChanged(_electionId, _active);
    }
    
    /**
     * @dev Adds voters to the whitelist for an election
     * @param _electionId ID of the election
     * @param _voters Array of voter addresses to add to whitelist
     */
    function addToWhitelist(
        uint256 _electionId, 
        address[] memory _voters
    ) public onlyElectionCreator(_electionId) electionExists(_electionId) {
        require(whitelistEnabled[_electionId], "Whitelist is not enabled for this election");
        
        for (uint256 i = 0; i < _voters.length; i++) {
            voterWhitelist[_electionId][_voters[i]] = true;
            emit VoterWhitelisted(_electionId, _voters[i]);
        }
    }
    
    /**
     * @dev Gets the number of candidates in an election
     * @param _electionId ID of the election
     * @return The number of candidates
     */
    function getCandidateCount(uint256 _electionId) public view electionExists(_electionId) returns (uint256) {
        return elections[_electionId].candidateCount;
    }
    
    /**
     * @dev Gets details of a candidate
     * @param _electionId ID of the election
     * @param _candidateId ID of the candidate
     * @return id, name, info, and voteCount of the candidate
     */
    function getCandidate(
        uint256 _electionId, 
        uint256 _candidateId
    ) public view electionExists(_electionId) returns (uint256, string memory, string memory, uint256) {
        require(_candidateId > 0 && _candidateId <= elections[_electionId].candidateCount, "Invalid candidate ID");
        
        Candidate memory candidate = candidates[_electionId][_candidateId];
        return (candidate.id, candidate.name, candidate.info, candidate.voteCount);
    }
    
    /**
     * @dev Gets details of an election
     * @param _electionId ID of the election
     * @return id, title, description, startTime, endTime, active status, and candidateCount of the election
     */
    function getElection(
        uint256 _electionId
    ) public view electionExists(_electionId) returns (
        uint256, string memory, string memory, uint256, uint256, bool, uint256, address
    ) {
        Election memory election = elections[_electionId];
        return (
            election.id,
            election.title,
            election.description,
            election.startTime,
            election.endTime,
            election.active,
            election.candidateCount,
            election.creator
        );
    }
    
    /**
     * @dev Checks if a voter has already voted in an election
     * @param _electionId ID of the election
     * @param _voter Address of the voter
     * @return Whether the voter has already voted
     */
    function checkVoted(uint256 _electionId, address _voter) public view electionExists(_electionId) returns (bool) {
        return hasVoted[_electionId][_voter];
    }
    
    /**
     * @dev Checks if a voter is whitelisted for an election
     * @param _electionId ID of the election
     * @param _voter Address of the voter
     * @return Whether the voter is whitelisted
     */
    function checkWhitelisted(uint256 _electionId, address _voter) public view electionExists(_electionId) returns (bool) {
        if (!whitelistEnabled[_electionId]) {
            return true;
        }
        return voterWhitelist[_electionId][_voter];
    }
    
    /**
     * @dev Gets the election results
     * @param _electionId ID of the election
     * @return Arrays of candidate IDs, names, and vote counts
     */
    function getElectionResults(
        uint256 _electionId
    ) public view electionExists(_electionId) returns (
        uint256[] memory, string[] memory, uint256[] memory
    ) {
        uint256 candidateCount = elections[_electionId].candidateCount;
        
        uint256[] memory ids = new uint256[](candidateCount);
        string[] memory names = new string[](candidateCount);
        uint256[] memory voteCounts = new uint256[](candidateCount);
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            Candidate memory candidate = candidates[_electionId][i];
            ids[i-1] = candidate.id;
            names[i-1] = candidate.name;
            voteCounts[i-1] = candidate.voteCount;
        }
        
        return (ids, names, voteCounts);
    }
}