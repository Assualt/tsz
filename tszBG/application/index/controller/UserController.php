<?php
/**
 * Created by PhpStorm.
 * User: jhon
 * Date: 2017/12/18
 * Time: 15:15
 */
namespace app\index\controller;
use think\Controller;

class UserController extends Controller{
    public function register()
    {
        $data=$_POST;

        $arr['success']=false;
        $arr["data"]=$data;
        $data1=json_encode($arr);
        var_dump($data1);
        $this->assign($data1);
        return $this->fetch("index/a")  ;
    }
}
