// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Pigeonhole {
    address public owner;

    struct Question {
        uint256 id;
        string content;
        uint256 likes;
    }

    struct Meeting {
        uint256 id;
        address author;
        string name;
        Question[] questions;
    }

    mapping(address => Meeting[]) public Meetings;

    event MeetingCreated(
        address indexed pigeonholeOwner,
        uint256 indexed pigeonholeId,
        string title
    );
    event QuestionAsked(
        address indexed pigeonholeOwner,
        uint256 indexed pigeonholeId,
        string question
    );
    event QuestionLiked(
        address indexed pigeonholeOwner,
        uint256 indexed pigeonholeId,
        uint256 questionId
    );
    event QuestionUnliked(
        address indexed pigeonholeOwner,
        uint256 indexed pigeonholeId,
        uint256 questionId
    );

    constructor() {
        owner = msg.sender;
    }

    function createMeeting(string memory _name) public {
        Meeting storage newMeeting = Meetings[msg.sender].push();

        newMeeting.id = Meetings[msg.sender].length - 1;
        newMeeting.author = msg.sender;
        newMeeting.name = _name;

        emit MeetingCreated(newMeeting.author, newMeeting.id, newMeeting.name);
    }

    function askQuestion(
        address _pigeonholeOwner,
        uint256 _pigeonholeId,
        string memory _question
    ) public {
        require(
            Meetings[_pigeonholeOwner][_pigeonholeId].id == _pigeonholeId,
            "Meeting does not exist"
        );
        Question memory newQuestion = Question({
            id: Meetings[_pigeonholeOwner][_pigeonholeId].questions.length,
            content: _question,
            likes: 0
        });
        Meetings[_pigeonholeOwner][_pigeonholeId].questions.push(newQuestion);
        emit QuestionAsked(
            _pigeonholeOwner,
            _pigeonholeId,
            newQuestion.content
        );
    }

    function likeQuestion(
        address _pigeonholeOwner,
        uint256 _pigeonholeId,
        uint256 _questionId
    ) public {
        require(
            Meetings[_pigeonholeOwner][_pigeonholeId].id == _pigeonholeId,
            "Meeting does not exist"
        );
        require(
            Meetings[_pigeonholeOwner][_pigeonholeId]
                .questions[_questionId]
                .id == _questionId,
            "Question does not exist"
        );
        Meetings[_pigeonholeOwner][_pigeonholeId]
            .questions[_questionId]
            .likes += 1;
        emit QuestionLiked(_pigeonholeOwner, _pigeonholeId, _questionId);
    }

    function unlikeQuestion(
        address _pigeonholeOwner,
        uint256 _pigeonholeId,
        uint256 _questionId
    ) public {
        require(
            Meetings[_pigeonholeOwner][_pigeonholeId]
                .questions[_questionId]
                .likes > 0,
            "Tweet does not have any likes"
        );
        Meetings[_pigeonholeOwner][_pigeonholeId]
            .questions[_questionId]
            .likes -= 1;
        emit QuestionUnliked(_pigeonholeOwner, _pigeonholeId, _questionId);
    }

    function getQuestions(
        address _pigeonholeOwner,
        uint256 _pigeonholeId
    ) public view returns (Question[] memory) {
        return Meetings[_pigeonholeOwner][_pigeonholeId].questions;
    }
}
