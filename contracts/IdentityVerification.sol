// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract IdentityVerification {

    struct Identity {
        string name;
        string institution;
        bool verified;
    }

    mapping(address => Identity) private identities;


    function registerIdentity(
        string memory _name,
        string memory _institution
    ) public {

        identities[msg.sender] = Identity(
            _name,
            _institution,
            false
        );
    }


    function verifyIdentity(
        address _user
    ) public {

        identities[_user].verified = true;

    }


    function getIdentity(
        address _user
    )
    public
    view
    returns(
        string memory,
        string memory,
        bool
    )
    {

        Identity memory user = identities[_user];

        return(
            user.name,
            user.institution,
            user.verified
        );

    }
}