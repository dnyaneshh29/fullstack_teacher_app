<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\TeacherModel;
use Firebase\JWT\JWT;
use Config\Database;

class Auth extends ResourceController
{
    /**
     * Register a new user
     */
    public function register()
    {
        $userModel = new UserModel();
        $teacherModel = new TeacherModel();
        $db = Database::connect(); // Get the database connection

        // Get JSON data from the request
        $json = $this->request->getJSON();

        // Start a transaction
        $db->transStart();

        // --- Create user in auth_user table ---
        $userData = [
            'first_name' => $json->first_name,
            'last_name'  => $json->last_name,
            'email'      => $json->email,
            'password'   => password_hash($json->password, PASSWORD_DEFAULT)
        ];

        // The UserModel's insert method will return the new user's ID
        $userId = $userModel->insert($userData, true);

        if ($userId === false) {
            $db->transRollback();
            // Get validation errors from the model
            return $this->fail($userModel->errors(), 400);
        }

        // --- Create teacher in teachers table ---
        $teacherData = [
            'user_id'         => $userId,
            'university_name' => $json->university_name,
            'gender'          => $json->gender,
            'year_joined'     => $json->year_joined
        ];

        if ($teacherModel->insert($teacherData) === false) {
            $db->transRollback();
            // Get validation errors from the model
            return $this->fail($teacherModel->errors(), 400);
        }

        // --- If all successful, complete transaction ---
        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->failServerError('An error occurred during the transaction.');
        }

        // --- Generate JWT Token ---
        $key = getenv('JWT_SECRET');
        $iat = time(); // issued at
        $exp = $iat + 3600; // expiration time (1 hour)

        $payload = [
            'iss' => 'CodeIgniter',
            'aud' => 'WebApp',
            'iat' => $iat,
            'exp' => $exp,
            'data' => [
                'user_id' => $userId,
                'email' => $userData['email']
            ]
        ];
        
        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respondCreated(['status' => 'success', 'message' => 'User registered successfully', 'token' => $token]);
    }

    /**
     * Authenticate an existing user
     */
    public function login()
    {
        $userModel = new UserModel();
        
        // Get JSON data from the request for login
        $json = $this->request->getJSON();
        $email = $json->email ?? null;
        $password = $json->password ?? null;

        $user = $userModel->where('email', $email)->first();

        if (is_null($user)) {
            return $this->failNotFound('Cannot find user with that email.');
        }

        $pwd_verify = password_verify((string)$password, $user['password']);

        if (!$pwd_verify) {
            return $this->fail('Incorrect password.');
        }

        $key = getenv('JWT_SECRET');
        $iat = time();
        $exp = $iat + 3600;

        $payload = [
            'iss' => 'CodeIgniter',
            'aud' => 'WebApp',
            'iat' => $iat,
            'exp' => $exp,
            'data' => [
                'user_id' => $user['id'],
                'email' => $user['email']
            ]
        ];
        
        $token = JWT::encode($payload, $key, 'HS256');

        $userData = [
            'id' => $user['id'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email']
        ];

        return $this->respond(['status' => 'success', 'message' => 'Login successful', 'token' => $token, 'user' => $userData]);
    }
}

