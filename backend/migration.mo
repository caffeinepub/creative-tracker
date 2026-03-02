import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type ProjectStatus = {
    #done;
    #inProgress;
    #approvalPending;
  };

  // New PositionalComment type
  type PositionalComment = {
    id : Nat;
    text : Text;
    xPercentage : Float;
    yPercentage : Float;
    timestamp : Int;
  };

  // Old CreativeProject without comments and counter
  type OldCreativeProject = {
    id : Text;
    title : Text;
    description : Text;
    completionTimestamp : Nat;
    amazonUploadTimestamp : ?Nat;
    creator : Principal.Principal;
    images : [Storage.ExternalBlob];
    createdAt : Int;
    updatedAt : Int;
    status : ProjectStatus;
  };

  // New CreativeProject with comments and counter
  type NewCreativeProject = {
    id : Text;
    title : Text;
    description : Text;
    completionTimestamp : Nat;
    amazonUploadTimestamp : ?Nat;
    creator : Principal.Principal;
    images : [Storage.ExternalBlob];
    createdAt : Int;
    updatedAt : Int;
    status : ProjectStatus;
    commentIdCounter : Nat;
    positionalComments : [PositionalComment];
  };

  type OldActor = {
    projectStore : Map.Map<Text, OldCreativeProject>;
  };

  type NewActor = {
    projectStore : Map.Map<Text, NewCreativeProject>;
  };

  public func run(old : OldActor) : NewActor {
    let newProjectStore = old.projectStore.map<Text, OldCreativeProject, NewCreativeProject>(
      func(_id, oldProject) {
        {
          oldProject with
          commentIdCounter = 0; // Initialize counter for existing projects
          positionalComments = []; // Start with empty comments for old projects
        };
      }
    );
    {
      projectStore = newProjectStore;
    };
  };
};
