import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

actor {
  include MixinStorage();

  type CreativeProject = {
    id : Text;
    title : Text;
    description : Text;
    completionTimestamp : Nat;
    amazonUploadTimestamp : ?Nat;
    creator : Principal;
    images : [Storage.ExternalBlob];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module CreativeProject {
    public func compare(project1 : CreativeProject, project2 : CreativeProject) : Order.Order {
      switch (Text.compare(project1.title, project2.title)) {
        case (#equal) {
          Nat.compare(project1.completionTimestamp, project2.completionTimestamp);
        };
        case (order) { order };
      };
    };
  };

  // In-memory storage for creative projects
  let projectStore = Map.empty<Text, CreativeProject>();

  // Create Creative Project
  public shared ({ caller }) func createProject(
    id : Text,
    title : Text,
    description : Text,
    completionTimestamp : Nat,
    amazonUploadTimestamp : ?Nat,
    images : [Storage.ExternalBlob],
  ) : async () {
    if (projectStore.containsKey(id)) {
      Runtime.trap("Project with this ID already exists");
    };

    let currentTime = Time.now();

    let newProject : CreativeProject = {
      id;
      title;
      description;
      completionTimestamp;
      amazonUploadTimestamp;
      creator = caller;
      images;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    projectStore.add(id, newProject);
  };

  // Read Creative Project
  public query ({ caller = _ }) func getProject(id : Text) : async CreativeProject {
    switch (projectStore.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  // Update Creative Project
  public shared ({ caller }) func updateProject(
    id : Text,
    title : Text,
    description : Text,
    completionTimestamp : Nat,
    amazonUploadTimestamp : ?Nat,
    images : [Storage.ExternalBlob],
  ) : async () {
    switch (projectStore.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existingProject) {
        if (existingProject.creator != caller) {
          Runtime.trap("Unauthorized: Only the creator can update this project");
        };

        let updatedProject : CreativeProject = {
          id;
          title;
          description;
          completionTimestamp;
          amazonUploadTimestamp;
          creator = existingProject.creator;
          images;
          createdAt = existingProject.createdAt;
          updatedAt = Time.now();
        };

        projectStore.add(id, updatedProject);
      };
    };
  };

  // Delete Creative Project
  public shared ({ caller }) func deleteProject(id : Text) : async () {
    switch (projectStore.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.creator != caller) {
          Runtime.trap("Unauthorized: Only the creator can delete this project");
        };
        projectStore.remove(id);
      };
    };
  };

  // Get All Projects
  public query ({ caller = _ }) func getAllProjects() : async [CreativeProject] {
    projectStore.values().toArray().sort();
  };

  // Get Projects by Creator
  public query ({ caller = _ }) func getProjectsByCreator(creator : Principal) : async [CreativeProject] {
    projectStore.values().toArray().filter(
      func(project) { project.creator == creator }
    );
  };
};
