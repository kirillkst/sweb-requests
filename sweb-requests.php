<?php
/*
 * @wordpress-plugin
 * Plugin Name:       Управление заявками
 * Description:
 * Version:           1.0.0
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class SWEB_Requests {
	protected $db, $path, $url, $table;

	function __construct() {
		global $wpdb;
		$this->db    = $wpdb;
		$this->url   = untrailingslashit( plugin_dir_url( __FILE__ ) );
		$this->path  = untrailingslashit( plugin_dir_path( __FILE__ ) );
		$this->table = 'wp_sweb_requests';

		register_activation_hook( __FILE__, [ $this, 'activate' ] );
		add_action( 'plugins_loaded', [ $this, 'init' ] );
	}

	function activate() {
		$table  = $this->table;
		$charset_collate = $this->db->get_charset_collate();

		if ( $this->db->get_var( "SHOW TABLES LIKE '{$table}'" ) != $table ) {
			$sql = "CREATE TABLE $table (
				id bigint(20) NOT NULL AUTO_INCREMENT,
				name varchar(255) NOT NULL DEFAULT '',
				phone varchar(255) NOT NULL DEFAULT '',
				additional text NOT NULL DEFAULT '',
				date datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
				PRIMARY KEY  (id)
			) $charset_collate;";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );
		}
	}

	function init() {
		require_once $this->path . '/includes/class-sweb-requests-form.php';
		new SWEB_Requests_Form( $this->db, $this->table );

		require_once $this->path . '/includes/class-sweb-requests-rest-api.php';
		new SWEB_Requests_REST_API( $this->db, $this->table );

		add_action( 'admin_menu', [ $this, 'create_admin_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts_styles' ], 10, 1 );
	}

	public function create_admin_menu() {
        add_menu_page( 'Заявки', 'Заявки', 'manage_options', 'sweb-requests', [ $this, 'render_page' ], 'dashicons-email-alt', 5 );
    }

	function render_page(){
		?>
		<div class="wrap">
			<h1><?php echo get_admin_page_title() ?></h1>
			<div id="sweb-requests" class="sweb-requests"></div>
		</div>
		<?php
	}

	public function enqueue_scripts_styles( $hook_suffix ) {
		if ( $hook_suffix != 'toplevel_page_sweb-requests' )
			return;

		$script_asset_path = $this->path . '/build/index.asset.php';
		$script_asset = file_exists( $script_asset_path )
        	? require( $script_asset_path )
        	: [ 'dependencies' => [], 'version' => 1 ];

		wp_enqueue_style(
			'sweb-requests',
			$this->url . '/build/style.css',
			[],
			filemtime( $this->path . '/build/style.css' ),
			'all'
		);

		wp_enqueue_script(
			'sweb-requests',
			$this->url . '/build/index.js',
			$script_asset['dependencies'],
        	$script_asset['version'],
			true
		);

		wp_localize_script( 'sweb-requests', 'swebRequests', [
			'nonce' => wp_create_nonce( 'wp_rest' )
		] );
	}

}

new SWEB_Requests();
