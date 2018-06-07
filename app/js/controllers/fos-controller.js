app.controller('FOSController', function ($scope, $http, $stateParams, $location, $rootScope, $modal, $sce) {

	$scope.fos = {};
	$scope.isUpdate = false;

	var actionHtmlContent = '<div class="ui-grid-cell-contents">'

							+ '<a ui-sref="app.fos-edit({fosId: row.entity._id })" class="edit">'
							+ '<i class="linecons-pencil"></i>'
							+ 'Assign'
							+ '</a>&nbsp'
							+ '<a ui-sref="app.fos-view({fosId: row.entity._id })" class="edit">'
							+ '<i class="linecons-eye"></i>'
							+ 'View'
							+ '</a>'
							+ '</div>'

	$scope.gridOptions = {
		// rowHeight: 40,
		enableFiltering: true,
		enableSorting: true,
		paginationPageSizes: [25, 50, 75],
		paginationPageSize: 10,
		columnDefs: [
			{
				name:  'S.No',
				field: 'name',
				cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
			},
		//{field: 'getFullName()', displayName: 'Name'},
			{ field: 'specialization', displayName : 'workordercategory'},
			{ field: 'subject'},
			{field: 'email'},
			{field: 'mobile', displayName: 'Mobile'},
			{field: 'flatno', displayName: 'flatno'},
			//{field: 'emergencyMobile', displayName: 'Mobile 3'},
			{
				field: 'createdAt',
				enableSorting: true,
				cellFilter: 'date:\'dd-MM-yyyy\''
			},
			{
				name:  'Action',
				field: 'name',
				cellTemplate: actionHtmlContent
			},
		],
		onRegisterApi: function (gridApi) {
			$scope.grid1Api = gridApi;
		}
	};

	var refresh = function() {
		$http.get('api/specializations').then(function(response){
			$scope.specializations = response.data.data;
		});
		$http.get('/api/fos/all').success(function(response) {
			$scope.fosList = response.data;
			$scope.gridOptions.data = response.data;
			angular.forEach($scope.gridOptions.data,function(row){
				row.getFullName = function(){
					return this.firstName + ' ' + this.lastName;
				}
				//row.specializationId = row.specializationInfo.specialization
			});
		});

		if($stateParams.fosId !== "undefined") {
			$http.get('/api/fos/' + $stateParams.fosId).then(function(response) {
				$scope.fos = response.data.fosInfo;
				if($location.absUrl().match("update") !== null) {
					$scope.isUpdate = true;
					$scope.fos = response.data.fosInfo.basicInfo;
					$scope.currentImage = response.data.fosInfo.basicInfo.avatar;
				}
			})
		}
	}

	refresh();

	$scope.createFOS = function(fos) {
		var fd = new FormData();
		for (var key in $scope.fos) {
			fd.append(key, $scope.fos[key])
		}
		$http.post('/api/fos/create', fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		}).then(function(response) {
			if(response.data.success) {
				$scope.showAlert = true;
				$scope.alert = {status: "success", message: 'New ticket raised'}
				$scope.fos = {}
			}
			else {
				$scope.showAlert = true;
				$scope.alert = {status: "danger", message: response.data.message}
				$scope.fos = {}
			}
		});
	}

	$scope.updateFOS = function() {
		$http.post('/api/fos/update', $scope.fos).success(function(response) {
			if(response.success) {
				$scope.showAlert = true;
				$scope.alert = { status: "success", message:'Assigned' };
			}
			else {
				$scope.showAlert = false;
				$scope.alert = { status: "danger", message: error };
			}
		})
	}

	$scope.openPasswordChangeModal = function(modal_id, modal_size, modal_backdrop) {
		$rootScope.currentModal = $modal.open({
			templateUrl: modal_id,
			size: modal_size,
			backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop,
			controller: function($scope, $http, $modalInstance, $state) {
				$http.get('/api/fos/' + $stateParams.fosId).then(function(response) {
					$scope.pwdUpdateInfo = response.data.fosInfo.basicInfo;
				});
				$scope.credential = {};
				$scope.updatePassword = function() {
					$scope.credential["email"] = $scope.pwdUpdateInfo.email;
					$http.post('/user/password-update', $scope.credential).success(function(response) {
						if(response.success) {
							$scope.showAlert = true;
							$scope.alert = { status: "success", message: response.message};
							$scope.credential = {};
						}
						else {
							$scope.showAlert = true;
							$scope.alert = { status: "danger", message: response.error};
						}
					})
				}
			}
		});
	};

	$scope.uploadImage = function(uploadObj, modelName) {
		var newObj = {avatar: uploadObj.avatar, id: uploadObj._id, model: modelName};
		var fd = new FormData();
		for(var key in newObj) {
			fd.append(key, newObj[key]);
		}
		$http.post('/api/upload-image', fd, {
				transformRequest: angular.indentity,
				headers: { 'Content-Type': undefined }
			})
			.success(function(response) {
				if(response.success) {
					$scope.showAlert = true;
					$scope.alert = {status: "success", message: response.message};
					refresh();
				}
				else {
					$scope.showAlert = true;
					$scope.alert = {status: "danger", message: response.error};
					refresh();
				}
			})
	}

});
