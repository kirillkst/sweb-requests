<?php
class SWEB_Requests_REST_API {
	protected $db, $table;

	function __construct( $db, $table ) {
		$this->db    = $db;
		$this->table = $table;

		add_action( 'rest_api_init', [ $this, 'register_rest_route' ] );
	}

	function register_rest_route() {
		register_rest_route( 'sweb-requests', 'get/page/(?P<page>\d+)', [
            'methods'  => WP_REST_Server::READABLE,
			'callback' => function( $request ) {
				return rest_ensure_response( $this->get_requests( $request ) );
			},
			'permission_callback' => 'is_user_logged_in',
			'args' => [
				'page' => [
					'default' => 1
				]
			]
        ] );

		register_rest_route( 'sweb-requests', 'delete/id/(?P<id>\d+)', [
			'methods'  => WP_REST_Server::DELETABLE,
			'callback' => function( $request ) {
				return rest_ensure_response( $this->delete_request( $request ) );
			},
			'permission_callback' => 'is_user_logged_in',
			'args' => [
				'id' => [
					'required' => true
				]
			]
		] );
	}

	function get_requests( WP_REST_Request $request ) {
		$page 	  = $request->get_param( 'page' );
		$per_page = 20;
		$total    = $this->db->get_var( "SELECT COUNT(*) FROM $this->table" ) ?: 1;
		$offset   = (($page - 1) * $per_page) % $total;
		$data 	  = $this->db->get_results(" SELECT * FROM $this->table ORDER by id DESC LIMIT {$offset}, {$per_page}", ARRAY_A );
		$response = [];

		$items = array_map(function( $arr ) {
			foreach ( $arr as $key => $value )
				$arr[ $key ] = maybe_unserialize( $value );

			return $arr;
		}, $data );

		$response = [
			'items'	      => $items,
			'maxPage' 	  => ceil( $total / $per_page),
			'currentPage' => $page
		];

		return $response;
	}

	function delete_request( WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );
		return $this->db->delete( $this->table, [ 'id' => $id ] );
	}
}
