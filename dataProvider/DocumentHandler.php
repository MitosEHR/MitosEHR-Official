<?php
/**
 * Created by JetBrains PhpStorm.
 * User: erodriguez
 * Date: 4/14/12
 * Time: 12:24 PM
 * To change this template use File | Settings | File Templates.
 */
if(!isset($_SESSION)) {
	session_name("MitosEHR");
	session_start();
	session_cache_limiter('private');
}
include_once($_SESSION['site']['root'] . '/classes/dbHelper.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Patient.php');
include_once($_SESSION['site']['root'] . '/dataProvider/User.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Encounter.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Services.php');
include_once($_SESSION['site']['root'] . '/dataProvider/Facilities.php');
class DocumentHandler
{

	private $db;
	private $user;
	private $patient;
	private $services;
	private $facility;

	private $pid;
	private $docType;
	private $workingDir;
	private $fileName;

	function __construct()
	{
		$this->db       = new dbHelper();
		$this->user     = new User();
		$this->patient  = new Patient();
		$this->services = new Services();
		$this->facility = new Facilities();
		return;
	}

	public function uploadDocument($params, $file)
	{
		$src = $this->setWorkingDir($params) . $this->setFileName($file);
		if(move_uploaded_file($file['filePath']['tmp_name'], $src)) {
			$doc = array();
			$doc['pid']     = $this->pid;
			$doc['uid']     = $_SESSION['user']['id'];
			$doc['docType'] = $this->docType;
			$doc['name']    = $this->fileName;
			$doc['url']     = $this->getDocumentUrl();
			$doc['date']    = date('Y-m-d H:i:s');
			$this->db->setSQL($this->db->sqlBind($doc, 'patient_documents', 'I'));
			$this->db->execLog();
			$doc_id = $this->db->lastInsertId;
			return array('success'=> true,
			             'doc'    => array('id'   => $doc_id,
			                               'name' => $this->fileName,
			                               'url'  => $this->getDocumentUrl()));
		} else {
			return array('success'=> false,
			             'error'  => 'File could not be uploaded');
		}
	}

	protected function getDocumentUrl()
	{
		return $_SESSION['site']['url'] . '/sites/' . $_SESSION['site']['site'] . '/patients/' . $this->pid . '/' . $this->docType . '/' . $this->fileName;
	}

	protected function setFileName($file)
	{
		$ext  = end(explode('.', $file['filePath']['name']));
		$name = time();
		while(file_exists($this->workingDir . '/' . $name)) {
			$name = time();
		}
		return $this->fileName = $name . '.' . $ext;
	}

	protected function setWorkingDir($params)
	{
		$this->pid     = (isset($params['pid'])) ? $params['pid'] : $_SESSION['patient']['pid'];
		$this->docType = (isset($params['docType'])) ? $params['docType'] : 'orphanDocuments';
		$path = $_SESSION['site']['root'] . '/sites/' . $_SESSION['site']['site'] . '/patients/' . $this->pid . '/' . $this->docType . '/';
		if(is_dir($path) || mkdir($path, 0777, true)) {
			chmod($path, 0777);
		}
		return $this->workingDir = $path;
	}


	public function getDocumentsTemplates(){
		$this->db->setSQL("SELECT * FROM documents_templates");
		return $this->db->fetchRecords(PDO::FETCH_ASSOC);
	}

	public function addDocumentsTemplates(stdClass $params){
		$data = get_object_vars($params);
		$data['created_by_uid'] = $_SESSION['user']['id'];
		$this->db->setSQL($this->db->sqlBind($data, 'documents_templates', 'I'));
		$this->db->execLog();
		$params->id = $this->db->lastInsertId;
		return $params;
	}

	public function updateDocumentsTemplates(stdClass $params){
		$data = get_object_vars($params);
		$data['update_by_uid'] = $_SESSION['user']['id'];
		$id = $data['id'];
		unset($data['id']);
		$this->db->setSQL($this->db->sqlBind($data, "documents_templates", "U", "id='$id'"));
		$this->db->execLog();
		return $params;

	}

}





