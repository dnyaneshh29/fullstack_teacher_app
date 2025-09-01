<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\TeacherModel;
use App\Models\UserModel;

class Teacher extends ResourceController
{
    /**
     * This method is not used for registration.
     */
    public function create()
    {
        return $this->failForbidden('This endpoint is not used for registration.');
    }

    /**
     * Return an array of all users from the auth_user table.
     */
    public function getUsers()
    {
        $userModel = new UserModel();
        $data = $userModel->select('id, first_name, last_name, email')->findAll();
        return $this->respond(['status' => 'success', 'data' => $data]);
    }

    /**
     * Return an array of all teachers from the teachers table.
     */
    public function getTeachers()
    {
        $teacherModel = new TeacherModel();
        $data = $teacherModel->findAll();
        return $this->respond(['status' => 'success', 'data' => $data]);
    }
}