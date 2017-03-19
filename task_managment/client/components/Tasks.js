var React = require('react');
var Auth =require('./modules/Auth1');
var ReactDOM = require('react-dom');

module.exports=Tasks = React.createClass({

		getInitialState: function(props){
			props = props || this.props;
			return {
				projectsName:props.projectsName,
				selectedProject:props.selectedProject,
				selectedTasks:[],
				tasks:props.tasks,
				errors:props.errors,
				task:{
					name:'',
					description:'',
					status:'',
					estimation:''
				}
			};
		},
		componentDidMount: function(){

	        var self=this;
	        const xhr = new XMLHttpRequest();
	        xhr.open('get', '/api/getProjectName');
	        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	        xhr.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
	        xhr.addEventListener('load', function(){
	          if (xhr.status === 200) {
	            var projectsName=JSON.parse(xhr.responseText);
	            self.setState({
	              projectsName: projectsName
	            });
	            if(projectsName&&projectsName[0]){
	            	console.log(projectsName[0]._id);
	            	 self.setState({
	             		 selectedProject: projectsName[0]._id
	            	});
	            	 self.loadTasks(projectsName[0]._id);
	            }
	          } else {
	            // failure

	            // change the component state
	            var errors = xhr.response.errors ? xhr.response.errors : {};
	            errors.summary1 = xhr.response.message;

	           self.setState({
	              errors:errors
	            });
	          }
	        });
	        xhr.send();
	    },
	    onProjectSelectionChange:function(e){
	    	this.setState({selectedProject:e.target.value});
	    	this.loadTasks(e.target.value);
	    },
	    loadTasks:function(projectid){

	        var self=this;
	        console.log(projectid);
	        var params = "projectid="+projectid;
	        const xhr = new XMLHttpRequest();
	        xhr.open('get', '/api/getTasksByProject'+'?'+params,true);
	        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	        xhr.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
	        xhr.addEventListener('load', function(){
	          if (xhr.status === 200) {
	            var tasks=JSON.parse(xhr.responseText);
	            self.setState({
	              tasks: tasks
	            });
	          } else {
	            // failure

	            // change the component state
	            var errors = xhr.response.errors ? xhr.response.errors : {};
	            errors.summary1 = xhr.response.message;

	           self.setState({
	              errors:errors
	            });
	          }
	        });
	        xhr.send();
	    },
		AddTask: function(e){
		
			e.preventDefault();
			var request = new XMLHttpRequest(), self = this;
			request.open("POST", "/api/addTask", true);
			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader('Authorization', 'bearer '+Auth.getToken());
			request.onreadystatechange = function() {//Call a function when the state changes.
				if(request.readyState == 4 && request.status == 200) {
				var updated =[];
				if(self.state.tasks)
				 	updated=self.state.tasks;
	      		// Push them onto the end of the current tweets array
				if(request.responseText){
					updated.push(JSON.parse(request.responseText));
				}
				self.setState({tasks: updated});
				}
				  $(ReactDOM.findDOMNode(self.refs.taskmodal)).modal('hide');
	            $(ReactDOM.findDOMNode(self.refs.taskmodal)).find("input,textarea,select").val('').end()
	            .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
			}
			self.state.task.project_id=self.state.selectedProject;
			request.send(JSON.stringify({task:self.state.task}));
		},
		handleHideModal:function(){
	        this.setState({view: {showModal: false}})
	    },
	    handleShowModal:function(){
	        $(ReactDOM.findDOMNode(this.refs.taskmodal)).modal();

	    },
	    handleSelection:function(val,flag){
	        if(flag){
	            this.setState({ 
	                selectedTasks: this.state.selectedTasks.concat([val])
	            });
	        }else{
	            var updatedIds=this.state.selectedTasks.map(function(id){
	                return val!=id;
	            });
	            this.setState({ 
	                selectedTasks: selectedTasks
	            });
	        }
	    },
	    changeTask:function(event) {
	        const field = event.target.name;
	         const task = this.state.task;
	        task[field] = event.target.value;
	        this.setState({task:task});
	  },

     render:function(){
     	var projectsName=[];
     	if(this.state.projectsName){
		  	 projectsName=this.state.projectsName.map (function(projectName) {
				return (
				<Options key={projectName._id} projectName={projectName}></Options>
				)
			});
	   }
		return(
        <div className="row">
                    <div className="col-lg-12">
                    	<div className="row">
                    		<div className="col-sm-6">
                        	<h2 className="page-header">Tasks</h2>
                        	</div>
                        	<div className="col-sm-6" >
                        		<h6>Select Project</h6>
                        		<select className="selectpicker pull-right" onChange={this.onProjectSelectionChange}>
							  		{projectsName}
								</select>
                        	</div>
                        </div>
                        <div className="row">
	                        <div className="col-sm-6">
	                            <div className="dt-buttons btn-group">
	                                <button className="btn btn-info btn-lg" onClick={this.handleShowModal}  disabled={this.state.selectedTasks.length!=0}>New</button>
	                                <button className="btn btn-info btn-lg" onClick={this.handleShowModal} disabled={this.state.selectedTasks.length!=1}>Edit</button>                
	                                <button className="btn btn-info btn-lg" disabled={this.state.selectedTasks.length==0}>Delete</button>
	                            </div>
	                        </div>
	                        <div className="col-sm-6">
	                        	<div id="example_filter" className="dataTables_filter">
	                        		<label>Search:<input type="search" className="form-control input-sm" placeholder="" aria-controls="example"/></label>
	                        	</div>
	                        </div>
                        </div>
                    </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                               All Tasks Of Selected Project
                            </div>
                            <div className="panel-body">
                                <TaskTable tasks={this.state.tasks } handleSelection={this.handleSelection}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-lg-12">
                	<TaskDialog onSubmitTask={this.AddTask} task={this.state.task} ref='taskmodal' onChangeInput={this.changeTask}></TaskDialog>
            	</div>
        </div>
		)
	}
 
});
Options=React.createClass({
  
    render: function(){
    return (
       <option value={this.props.projectName._id}>{this.props.projectName.p_name}</option>
	)
	}
});
TaskTable = React.createClass({
    render: function(){
       var tasks =[];
	   if(this.props.tasks){
		   tasks=this.props.tasks.map (function(task) {
				return (
				<TaskObj key={ task._id } task={ task } handleSelection={this.handleSelection}></TaskObj>
				)
			});
	   }

        return  (
			<div className="table-responsive" >
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr role="row">
                        	<th className="center-block"><input type="checkbox" /></th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Estimation</th>
                            <th>Updated_at</th>
                        </tr>
                    </thead>
                    <tbody>
                        { tasks}
                    </tbody>
                </table>
            </div>
		)
	}
});

TaskObj = React.createClass({
  	clickCheckBox:function(e){
        if (e.target.type !== 'checkbox') {
        	var check=false;
        	var clickVal=$(e.target).siblings().find('input#tid').val();
        	console.log(clickVal);
            $(e.target).siblings().find('input:checkbox:first').prop('checked', function( i, val ) {
               check=!val;
                return !val;
            });
            this.handleSelection(clickVal,check);
        }
        
    },
    render: function(){

    return (
       <tr className="" role="row" onClick={this.clickCheckBox}>
       		<td className="center-block"><input type="checkbox" /></td>
       		<td ><input type="hidden" id="tid" value={this.props.task._id}/></td>
            <td className="">{ this.props.task.name }</td>
            <td className="">{ this.props.task.description }</td>
            <td className="">{ this.props.task.status}</td>
            <td className="">{ this.props.task.estimation}</td>
            <td className="">{ this.props.task.updated_at}</td>

        </tr>
	)
	}
});
TaskDialog=React.createClass({
    render:function(){
        return (
            <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Add Task</h4>
                </div>
                <div className="modal-body">
                 <form className="form-horizontal" onSubmit={this.props.onSubmitTask}>
                    <fieldset>

                        <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputp_name">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="name" placeholder="Name" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                           <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputdescription">Description</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="description" placeholder="Description" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>
                         
                          <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputStatus">Status</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="status" placeholder="Status" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                          <div className="form-group">
                            <label  className="col-sm-2 control-label" htmlFor ="inputEstimation">Estimation</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" name="estimation" placeholder="Estimation" onChange={this.props.onChangeInput}/>
                            </div>
                         </div>

                       </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={this.props.onSubmitTask}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        )
    }
});

