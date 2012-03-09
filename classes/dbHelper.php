<?php
if(!isset($_SESSION)){
    session_name ( 'MitosEHR' );
    session_start();
    session_cache_limiter('private');
}
set_include_path($_SESSION['site']['root'].'/lib/LINQ_040/Classes/');
require_once'PHPLinq/LinqToObjects.php';
/**
 * @brief       Database Helper Class.
 * @details     A PDO helper for MitosEHR, contains custom function to manage the database
 *              in MitosEHR. PDO is new in PHP v5.
 *
 *              The PHP Data Objects (PDO) extension defines a lightweight,
 *              consistent interface for accessing databases in PHP.
 *              Each database driver that implements the PDO interface can expose database-specific
 *              features as regular extension functions. Note that you cannot perform any database
 *              functions using the PDO extension by itself;
 *              you must use a database-specific PDO driver to access a database server.
 *
 *              PDO provides a data-access abstraction layer, which means that,
 *              regardless of which database you're using, you use the same functions to issue queries
 *              and fetch data. PDO does not provide a database abstraction; it doesn't rewrite
 *              SQL or emulate missing features.
 *              You should use a full-blown abstraction layer if you need that facility.
 *
 *              PDO ships with PHP 5.1, and is available as a PECL extension for PHP 5.0;
 *              PDO requires the new OO features in the core of PHP 5, and so will not
 *              run with earlier versions of PHP.
 *
 * @author      Gino Rivera (Certun) <grivera@certun.com>
 * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
 * @version     Vega 1.0
 * @copyright   Gnu Public License (GPLv3)
 *
 */
class dbHelper {
	
    /**
     * @var
     */
    public $sql_statement;
    /**
     * @var
     */
    public $lastInsertId;
    /**
     * @var PDO
     */
    protected $conn;
   	/**
     * @var string
     */
    private $err;

    /**
     * @brief       dbHelper contructor.
     * @details     This method starts the connection with mysql server using $_SESSION values
     *              during the login proccess.
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     */
	function __construct()
    {
		error_reporting(0);
        $host   = $_SESSION['site']['db']['host'];
        $port   = $_SESSION['site']['db']['port'];
        $dbname = $_SESSION['site']['db']['database'];
        $dbuser = $_SESSION['site']['db']['username'];
        $dbpass = $_SESSION['site']['db']['password'];
		try {
    		$this->conn = new PDO( 'mysql:host='.$host.';port='.$port.';dbname='.$dbname,$dbuser,$dbpass,
                array(PDO::ATTR_PERSISTENT => true)
            );
		} catch (PDOException $e) {
    		$this->err = $e->getMessage();
		}
	}

    /**
     * @brief       Filter Records By Sart and Limit.
     * @details     This Function will filter the $records by a start and Limit usin LinQ.
     *              The main reason to use LinQ is to avoid multiples SQl queries to get
     *              the record totals and filter resutls.
     *
     * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
     * @version     Vega 1.0
     *
     * @warning     This method requires stdClass arguments. Use PDO::FETCH_CLASS to sexecute the SQL queries.
     *
     * @see         Logs::getLogs() for basic example and Patient::patientLiveSearch() for advance example.
     *
     * @param       $records SQL recordes to filter
     * @param       stdClass $params Params used to filter the results, $params->start and $params->limit are required
     * @return      mixed Records filtered
     */
    function filertByStartLimit($records, stdClass $params)
    {
        if(isset($params->start) && isset($params->limit)){
            $records = from('$record')->in($records)
                       ->skip($params->start)
                       ->take($params->limit)
                       ->select('$record');
            return $records;
        }else{
            return $records;
        }
    }

    /**
     * @brief       Filter Records By Query
     * @details     This function will filter the record by a column value
     *
     * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
     * @version     Vega 1.0
     *
     * @warning     This method requires stdClass $records. Use PDO::FETCH_CLASS to sexecute the SQL queries.
     *
     * @see         Services::getServices() for example.
     *
     * @param       $records SQL recordes to filter
     * @param       string $column databe column to filter
     * @param       $query value you are looking for
     * @return      mixed Records filtered
     */
    function filertByQuery($records, $column, $query)
    {
            $records = from('$record')->in($records)
                       ->where('$record => $record->'.$column.' == '.$query.'' )
                       ->select('$record');
            return $records;

    }

    /**
     * @brief       Set the SQL Statement.
     * @details     This method set the SQL statement in
     *              $this->sql_statement for othe methods to use it
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @see         Logs::getLogs() for basic example and Patient::patientLiveSearch() for advance example.
     *
     * @param       $sql string statement to set
     */
	function setSQL($sql)
    {
		$this->sql_statement = $sql;
	}

    /**
     * @brief       Execute Statement.
     * @details     This method is a simple SQL Statement, with no Event LOG injection
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @see         Logs::getLogs() for basic example and Patient::patientLiveSearch() for advance example.
     *
     * @param       int default to (PDO::FETCH_BOTH) Please see Fetch Style docs at <a href="http://php.net/manual/en/pdostatement.fetch.php">PDO Statement Fetch</a>
     * @return      array of records, if error occurred return the error instead
     */
	function execStatement($fetchStyle = PDO::FETCH_BOTH)
    {
		$recordset = $this->conn->query($this->sql_statement);
		if (stristr($this->sql_statement, 'SELECT')){
			$this->lastInsertId = $this->conn->lastInsertId();
		}
		$err = $this->conn->errorInfo();
		if(!$err[2]){
			return $recordset->fetchAll($fetchStyle);
		} else {
			return $err;
		}
	}

    /**
     * @brief       Execute Statement "WITHOUT" returning records
     * @details     Simple exec SQL Statement, with no Event LOG injection.
     *              For example to execute an ALTER a table.
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @return      array Connection error info if any
     */
	function execOnly()
    {
        $this->conn->query($this->sql_statement);
		if (stristr($this->sql_statement, 'SELECT')){
			$this->lastInsertId = $this->conn->lastInsertId();
		}
		return $this->conn->errorInfo();
	}

    /**
     * @brief       SQL Bind.
     * @details     This method is used to INSERT and UPDATE the database.
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @note        To eliminate fields that are not in the database you can use unset($b_array['field']);
     * @warning     To UPDATE you can NOT pass the ID in the $b_array.
     *              Make user to unset the ID before calling this method.
     *
     * @see         User::addUser() for Add example and  User::updateUser() for Update example.
     *
     * @param       array $b_array  containing a key that has to be the exact field on the data base, and it's value
     * @param       string $table  A valid database table to make the SQL statement
     * @param       string $iu Insert or Update parameter. This has to options I = Insert, U = Update
     * @param       string $where If in $iu = U is used you must pass a WHERE clause in the last parameter. ie: id='1', list_id='patient'
     * @return      string cunstructed SQL string
     */

	function sqlBind($b_array, $table, $iu='I', $where)
    {
        if(isset($b_array['__utma']))   unset($b_array['__utma']);
        if(isset($b_array['__utmz']))   unset($b_array['__utmz']);
        if(isset($b_array['MitosEHR'])) unset($b_array['MitosEHR']);

        $sql = '';
		/**
         * Step 1 -  Create the INSERT or UPDATE Clause
         */
		$iu = strtolower($iu);
		if ($iu == 'i'){
            $sql = 'INSERT INTO '.$table;
		} elseif($iu == 'u'){
            $sql = 'UPDATE '.$table;
		}
		/**
         * Step 2 -  Create the SET clause
         */
        $sql .= ' SET ';
		foreach($b_array as $key => $value){
			if( $where <> ($key . "='" . addslashes($value) . "'") &&
                $where <> ($key . "="  . addslashes($value)) &&
                $where <> ($key . '="' . addslashes($value) . '"')){
				$sql .= $key . "='" . trim(addslashes($value)) . "', ";
			}else{
                return array(
                    'success'=>false,
                    'error'=>'Where value can not be updated. please make sure to unset it from the array'
                );
            }
		}
        $sql = substr($sql, 0, -2);
		/**
         * Step 3 - Create the WHERE clause, if applicable
         */
		if ($iu == 'u'){ $sql .= ' WHERE ' . $where; }
		return $sql;
	}

    /**
    * @brief       SQL Select Builder.
    * @details     This method is used to build Select statements for MySQL.
    *
    * @author      Gino Rivera (Certun) <grivera@certun.com>
    * @version     Vega 1.0
    *
    * @param $Table
    * @param $Fields
    * @param $Order
    * @param $Where
    */
    function sqlSelectBuilder($Table, $Fields, $Order, $Where){

        // Step 1 - Select clause and wrote down the fields
        $sqlReturn = 'SELECT ';
        foreach($Fields as $key => $value) $sqlReturn .= $value . ", ";
        $sqlReturn = substr($sqlReturn, 0, -2);

        // Step 2 - From clause, the filter part
        $sqlReturn .= "FROM " . $Table . " ";

        // Step 3 - Order clause, sort the results
        if($Order <> "") foreach($Order as $key => $value) $sqlReturn .= "ORDER BY " . $value . ", ";
        $sqlReturn = substr($sqlReturn, 0, -2);

        // Step 4 - Where clause, filter the records
        if($Where <> ""){
            $sqlReturn .= "WHERE ";
            foreach($Where as $key => $value) $sqlReturn .= $key . "==" . $value . " , ";
        }

        $sqlReturn = substr($sqlReturn, 0, -2);

        return $sqlReturn;
    }

    /**
     * @brief       Execute Log.
     * @details     This method is used to INSERT, UPDATE, DELETE, and ALTER the database.
     *              with a event log injection.
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @note        The Log Injection is automatic It tries to detect an insert, delete, alter and log the event
     *
     * @see         User::addUser() for Add example.
     *
     * @return      array Connection error info if any
     */
	function execLog()
    {
		/**
		 * Execute the sql statement
		 */
		$this->conn->query( $this->sql_statement );

		if (stristr($this->sql_statement, "INSERT") ||
			stristr($this->sql_statement, "DELETE") ||
			stristr($this->sql_statement, "UPDATE") ||
			stristr($this->sql_statement, "ALTER")){

            $this->lastInsertId = $this->conn->lastInsertId();

			if (stristr($this->sql_statement, "INSERT")) { $eventLog = "Record insertion"; }
			if (stristr($this->sql_statement, "DELETE")) $eventLog = "Record deletion";
			if (stristr($this->sql_statement, "UPDATE")) $eventLog = "Record update";
			if (stristr($this->sql_statement, "ALTER")) $eventLog = "Table alteration";
			/**
             * Prepare the SQL statement first, and then execute.
             */
            $sql = "INSERT INTO	log (date, facility, event, comments, user, patient_id, checksum)
            		VALUES (:dtime, :facility, :event, :comments, :user, :patient_id, :checksum)";
			$stmt = $this->conn->prepare($sql);
			$stmt->bindParam(':dtime', date('Y-m-d H:i:s'), PDO::PARAM_STR);
            $stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
			$stmt->bindParam(':comments', $this->sql_statement, PDO::PARAM_STR);
			$stmt->bindParam(':user', $_SESSION['user']['name'], PDO::PARAM_STR);
			$stmt->bindParam(':checksum', crc32($this->sql_statement), PDO::PARAM_STR);
			$stmt->bindParam(':facility', $_SESSION['site']['facility'], PDO::PARAM_STR);
			$stmt->bindParam(':patient_id', $_SESSION['patient']['id'], PDO::PARAM_INT);
			$stmt->execute();
		}
		return $this->conn->errorInfo();
	}

    /**
     * @brief       Execute Event
     * @details     This method is used to Inject directly to the evente log
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @param       string $eventLog event data to log
     * @return      array Connection error info if any
     */
	function execEvent($eventLog)
    {
		$stmt = $this->conn->prepare("INSERT INTO log (date, event, comments, user, patient_id) VALUES (:dtime, :event, :comments, :user, :patient_id)");
		$stmt->bindParam(':dtime', date('Y-m-d H:i:s'), PDO::PARAM_STR);
		$stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
		$stmt->bindParam(':comments', $this->sql_statement, PDO::PARAM_STR);
		$stmt->bindParam(':user', $_SESSION['user']['name'], PDO::PARAM_STR);
		$stmt->bindParam(':patient_id', $_SESSION['patient']['id'], PDO::PARAM_INT);
		$stmt->execute();
		return $this->conn->errorInfo();
	}

    /**
     * @brief       Fetch
     * @details     This method is used to fetch only one record from the database
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @return      array of record or error if any
     */
	function fetch()
    {
		// Get all the records
		$recordset = $this->conn->query( $this->sql_statement );
        $err = $this->conn->errorInfo();
        if(!$err[2]){
            return $recordset->fetch(PDO::FETCH_ASSOC);
        } else {
            return $err;
        }

	}

    /**
     * @brief       Fetch the last error.
     * @details     If there was a problem with the connection it will return
     *              the error message, if the was not a connection problem, it will
     *              return a array with the code and message.
     *
     * @author      Gino Rivera (Certun) <grivera@certun.com>
     * @version     Vega 1.0
     *
     * @return      array|string
     */
	function getError()
    {
		if (!$this->err){
			return $this->conn->errorInfo();
		} else {
			return $this->err;
		}
	}
	
    /**
     * @brief       Row Count
     * @details     This methos is used to query an statement and return the rows coount using PDO
     *
     * @author      Ernesto J. Rodriguez (Certun) <erodriguez@certun.com>
     * @version     Vega 1.0
     *
     * @note        count($sql) should be use insted of this method.
     *              please refer to @ref Logs::getLogs() to see an example
     *              of how to use count();
     *
     * @return      int The number of rows in a table
     */
	function rowCount()
    {
		$recordset = $this->conn->query( $this->sql_statement );
		return $recordset->rowCount();
	}
}
