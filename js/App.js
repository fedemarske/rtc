var app = angular.module('RtcApp', ['ngMaterial']);

app.controller("RtcController", function($scope,$log){
    var self = this;

    self.videos = false;
    self.loginSuccess = false;
    self.videoOut = false;
    self.talk = false;
    self.video_2 = null;
    self.theOther = null;
    self.userName = "";

    self.login = function() {
        var user_name = self.username || "Anonymous";
        var phone = window.phone = PHONE({
            number        : user_name, // listen on username line else Anonymous
            publish_key   : 'pub-c-2dd69866-318e-4ea4-84fa-b38d7fe74c8d',
            subscribe_key : 'sub-c-ebfc8486-a8db-11e5-bd8c-0619f8945a4f',
            datachannels  : true,  // Enable Data Channels
            ssl: true
        });
        phone.ready(function(){
            $scope.$apply(function(){
                self.loginSuccess = true;
                self.videos = true;
                self.userName = phone.number();
                phone.video.style.display = "none";
                phone.video.id = "video_in";
                phone.video.muted = true;
                phone.video.style.borderRadius = "165px";
                phone.video.style.background = "black";
                video_in.appendChild(phone.video);
            })
        });
        phone.receive(function(session){
            session.connected(function(session) {
                $scope.$apply(function(){
                    self.videoOut = true;
                    self.theOther = session;
                    session.video.style.display = "none";
                    session.video.id = "video_out";
                    session.video.muted = true;
                    session.video.width  = 200;
                    session.video.height = 200;
                    session.video.style.borderRadius = "165px";
                    session.video.style.background = "black";
                    video_out.appendChild(session.video);
                });
            });
            session.ended(function(session) {
                video_out.innerHTML='';
                self.talk = false;
                self.videoOut = false;
            });
        });
        phone.message(function(session, message) {
            console.log(message)
            if(message.data){
                if(phone.number() !== session.number){
                    document.getElementById("video_out").style.display = "block";
                    document.getElementById("video_out").muted= false;
                }
            }else{
                document.getElementById("video_out").style.display = "none";
                document.getElementById("video_out").muted= true;
                //session.stopAudio();
            }
        } );
        return false;
    }

    self.makeCall = function(){
        self.videoOut = true;
        phone.dial(self.number);
    }

    self.pushToTalk = function(){
        self.talk = true;
        console.log(self.theOther)
        self.theOther.send({data: 1 });
        document.getElementById("video_in").style.display = "block";
    }

    self.end = function(){
        if (!window.phone) return;
        self.theOther.send({data: 0 });
        document.getElementById("video_in").style.display = "none";
        self.talk = false;
    }

    self.endConnection = function(){
        window.phone.hangup();
        self.videoOut = false;
    }
});
