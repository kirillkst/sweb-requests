<?php
class SWEB_Requests_Form {
	protected $db, $table;

	function __construct( $db, $table ) {
		$this->db    = $db;
		$this->table = $table;

		add_action( 'sweb_save_form_data', [ $this, 'save_form' ] );
	}

	function save_form() {
		if ( empty( $_POST ) )
			return;

        $data = $_POST;
        $insert = [];
        $fields = [ 'name', 'phone' ];

        unset( $data['action'] );
        unset( $data['formName'] );
        unset( $data['_wp_http_referer'] );
        unset( $data['_wpnonce'] );

		foreach ( $data as $key => $value ) {
			if ( in_array( $key, $fields ) )
				$insert[ $key ] = $value;
			else
				$insert['additional'][ $key ] = $value;
		}

        foreach ( $insert as $key => $value )
			$insert[ $key ] = maybe_serialize( $value );

		$insert['date'] = current_time("Y-m-d H:i:s");

		$result = $this->db->insert( $this->table, $insert );

        return $result;
	}
}
