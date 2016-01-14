var app = angular.module('RtcApp', ['ngMaterial']);

app.controller("RtcController", function($scope,$log){
    var self = this;

    self.videos = false;
    self.loginSuccess = false;
    self.videoOut = false;
    self.videoOut2 = false;
    self.talk = false;
    self.video_2 = null;
    self.theOther = null;
    self.userName = "";
    self.join = false;
    self.sessions = [];
    self.hoster = false;
    self.hosterName = "";
    self.talkMute = "Push To Talk";

    self.login = function(flag) {
        var user_name = self.username || "Anonymous";

        var phone = window.phone = PHONE({
            number        : user_name, // listen on username line else Anonymous
            publish_key   : 'pub-c-2dd69866-318e-4ea4-84fa-b38d7fe74c8d',
            subscribe_key : 'sub-c-ebfc8486-a8db-11e5-bd8c-0619f8945a4f',
            datachannels  : true,  // Enable Data Channels
            ssl: true,
            uuid: "test"
        });

        phone.ready(function(){
            $scope.$apply(function(){

                phone.channels(function(chs){
                    console.log(chs)
                    if(chs.channels.length !== 0){
                        for(var i = 0; i < chs.channels.length; i++){
                            if(chs.channels[i] !== phone.number()){
                                phone.dial(chs.channels[i]);
                            }
                        }
                    }
                });

                self.userName = phone.number();
                phone.video.style.display = "none";
                phone.video.id = "video_in";
                phone.video.muted = true;
                phone.video.className = "v1";
                video_in.appendChild(phone.video);
                self.loginSuccess = true;
                self.videos = true;
                self.hoster = true;
                if(flag){
                    self.loginSuccess = true;
                    self.videos = true;
                    self.hoster = true;
                    //self.hosterName = phone.number();
                }
            })
        });

        phone.receive(function(session){
            session.connected(function(session) {
                phone.convers();
                if(session.number !== "mobile"){
                    self.talk = true;
                    $scope.$apply(function(){
                        if($('#vid-box').is(':empty')){
                            if(!self.hoster){
                                self.hosterName = session.number;
                            }
                            console.log("primer div")
                            self.videoOut = true;
                            self.theOther = session;
                            session.video.style.display = "none";
                            session.video.id = session.number;
                            session.video.muted = true;
                            session.video.width  = 200;
                            session.video.height = 100;
                            session.video.className = "v2";
                            video_out.appendChild(session.video);
                        }else{
                            self.theOther2 = session;
                            self.videoOut2 = true;
                            session.video.style.display = "none";
                            session.video.id = session.number;
                            session.video.muted = true;
                            session.video.width  = 200;
                            session.video.height = 100;
                            session.video.className = "v2";
                            video_out_2.appendChild(session.video);
                            if(self.hoster){
                                session.send({otherSession: self.theOther.number})
                            }
                        }
                    });
                }
                
            });
            session.ended(function(session) {
                $scope.$apply(function(){
                    console.log(session)
                    self.videoOut = false;
                    self.talk = false;
                    $('#' + session.number).remove();
                })
            });
        });

        phone.message(function(session, message) {
            console.log(message)
            if(message.otherSession && phone.number() !== session.number){
                phone.dial(message.otherSession);
            }else{
                if(message.data){
                    console.log(session)
                    if(phone.number() !== session.number){
                        document.getElementById(session.number).style.display = "block";
                        document.getElementById(session.number).muted= false;
                    }
                }else{
                    document.getElementById(session.number).style.display = "none";
                    document.getElementById(session.number).muted= true;
                }
            }
        } );
        return false;
    }

    /*self.makeCall = function(){
        self.loginSuccess = true;
        self.videos = true;
        self.videoOut = true;
        self.join = false;
        phone.dial(self.number)
    }

    self.joinRoom = function(){
        self.join = true;
        self.login();
    }*/

    self.pushToTalk = function(){
        self.talkMute = "Push To Mute";
        self.theOther.send({data: 1 });
        if(self.theOther2){
            self.theOther2.send({data: 1 });
        }
        document.getElementById("video_in").style.display = "block";
    }

    self.end = function(){
        if (!window.phone) return;
        self.theOther.send({data: 0 });
        if(self.theOther2){
            self.theOther2.send({data: 0 });
        }
        document.getElementById("video_in").style.display = "none"
        self.talkMute = "Push To Talk";
    }

    self.endConnection = function(){
        self.loginSuccess = false;
        self.videos = false;
        self.videoOut = false;
        self.join = true;
        window.phone.hangup();
    }

});
