<?php



namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Customization extends Model
{
    protected $fillable = ['name','price','image_filename','category','custom'];
    
}