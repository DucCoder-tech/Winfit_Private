( function( $, elementor ) {

	'use strict';

	var JetTricks = {

		init: function() {
			elementor.hooks.addAction( 'frontend/element_ready/section', JetTricks.elementorSection );
			elementor.hooks.addAction( 'frontend/element_ready/column', JetTricks.elementorColumn );
			elementor.hooks.addAction( 'frontend/element_ready/widget', JetTricks.elementorWidget );

			var widgets = {
				'jet-view-more.default' : JetTricks.widgetViewMore,
				'jet-unfold.default' : JetTricks.widgetUnfold,
				'jet-hotspots.default' : JetTricks.widgetHotspots
			};

			$.each( widgets, function( widget, callback ) {
				elementor.hooks.addAction( 'frontend/element_ready/' + widget, callback );
			});
		},

		elementorSection: function( $scope ) {
			var $target        = $scope,
				$stuck         = $( '.elementor-container', $target ),
				editMode       = Boolean( elementor.isEditMode() ),
				stickySection;
		},

		elementorColumn: function( $scope ) {
			var $target  = $scope,
				$window  = $( window ),
				columnId = $target.data( 'id' ),
				editMode = Boolean( elementor.isEditMode() ),
				settings = {},
				stickyInstance = null,
				stickyInstanceOptions = {
					topSpacing: 50,
					bottomSpacing: 50,
					containerSelector: '.elementor-row',
					innerWrapperSelector: '.elementor-column-wrap',
				};

			if ( ! editMode ) {
				settings = $target.data( 'settings' );

				if ( $target.hasClass( 'jet-sticky-column' ) ) {

					if ( -1 !== settings['stickyOn'].indexOf( elementorFrontend.getCurrentDeviceMode() ) ) {

						stickyInstanceOptions.topSpacing = settings['topSpacing'];
						stickyInstanceOptions.bottomSpacing = settings['bottomSpacing'];

						$target.data( 'stickyColumnInit', true );
						stickyInstance = new StickySidebar( $target[0], stickyInstanceOptions );

						$window.on( 'resize.JetTricksStickyColumn orientationchange.JetTricksStickyColumn', JetTricksTools.debounce( 50, resizeDebounce ) );
					}
				}
			} else {
				settings = JetTricks.columnEditorSettings( columnId );

				if ( 'true' === settings['sticky'] ) {
					$target.addClass( 'jet-sticky-column' );

					if ( -1 !== settings['stickyOn'].indexOf( elementorFrontend.getCurrentDeviceMode() ) ) {
						stickyInstanceOptions.topSpacing = settings['topSpacing'];
						stickyInstanceOptions.bottomSpacing = settings['bottomSpacing'];

						$target.data( 'stickyColumnInit', true );
						stickyInstance = new StickySidebar( $target[0], stickyInstanceOptions );

						$window.on( 'resize.JetTricksStickyColumn orientationchange.JetTricksStickyColumn', JetTricksTools.debounce( 50, resizeDebounce ) );
					}
				}
			}

			function resizeDebounce() {
				var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
					availableDevices  = settings['stickyOn'] || [],
					isInit            = $target.data( 'stickyColumnInit' );

				if ( -1 !== availableDevices.indexOf( currentDeviceMode ) ) {

					if ( ! isInit ) {
						$target.data( 'stickyColumnInit', true );
						stickyInstance = new StickySidebar( $target[0], stickyInstanceOptions );
						stickyInstance.updateSticky();
					}
				} else {
					$target.data( 'stickyColumnInit', false );
					stickyInstance.destroy();
				}
			}

		},

		elementorWidget: function( $scope ) {
			var instance = null;

			instance = new jetWidgetParallax( $scope );
			instance.init();
		},

		widgetViewMore: function( $scope ) {
			var $target         = $scope.find( '.jet-view-more' ),
				instance        = null,
				settings        = $target.data( 'settings' );

			instance = new jetViewMore( $target, settings );
			instance.init();
		},

		widgetUnfold: function( $scope ) {
			var $target         = $scope.find( '.jet-unfold' ),
				$button         = $( '.jet-unfold__button', $target ),
				$mask           = $( '.jet-unfold__mask', $target ),
				$content        = $( '.jet-unfold__content', $target ),
				settings        = $target.data( 'settings' ),
				maskHeight      = +settings['height']['size'] || 100,
				separatorHeight = +settings['separatorHeight']['size'] || 20,
				unfoldDuration  = settings['unfoldDuration'],
				foldDuration    = settings['unfoldDuration'],
				unfoldEasing    = settings['unfoldEasing'],
				foldEasing      = settings['foldEasing'];

			if ( ! $target.hasClass( 'jet-unfold-state' ) ) {
				$mask.css( {
					'height': maskHeight
				} );
			}

			$button.on( 'click.jetUnfold', function() {
				var $this         = $( this ),
					$buttonText   = $( '.jet-unfold__button-text', $this ),
					unfoldText    = $this.data( 'unfold-text' ),
					foldText      = $this.data( 'fold-text' ),
					$buttonIcon   = $( '.jet-unfold__button-icon', $this ),
					unfoldIcon    = $this.data( 'unfold-icon' ),
					foldIcon      = $this.data( 'fold-icon' ),
					contentHeight = $content.outerHeight();

				if ( ! $target.hasClass( 'jet-unfold-state' ) ) {
					$target.addClass( 'jet-unfold-state' );

					$buttonIcon.html( '<i class="' + foldIcon + '"></i>' );
					$buttonText.html( foldText );

					anime( {
						targets: $mask[0],
						height: contentHeight,
						duration: unfoldDuration['size'],
						easing: unfoldEasing
					} );
				} else {
					$target.removeClass( 'jet-unfold-state' );

					$buttonIcon.html( '<i class="' + unfoldIcon + '"></i>' );
					$buttonText.html( unfoldText );

					anime( {
						targets: $mask[0],
						height: maskHeight,
						duration: foldDuration['size'],
						easing: foldEasing
					} );
				}
			} );
		},

		widgetHotspots: function( $scope ) {
			var $target   = $scope.find( '.jet-hotspots' ),
				$hotspots = $( '.jet-hotspots__item', $target),
				settings  = $target.data( 'settings' );

			$target.imagesLoaded().progress( function() {
				$target.addClass( 'image-loaded' );
			} );

			$hotspots.each( function( index ) {
				var $this      = $( this ),
					horizontal = $this.data( 'horizontal-position' ),
					vertical   = $this.data( 'vertical-position' );

				$this.css( {
					'left': horizontal + '%',
					'top': vertical + '%'
				} );

				tippy( $this[0], {
					arrow: settings['tooltipArrow'],
					arrowType: settings['tooltipArrowType'],
					arrowTransform: settings['tooltipArrowSize'],
					duration: [ settings['tooltipShowDuration']['size'], settings['tooltipHideDuration']['size'] ],
					distance: settings['tooltipDistance']['size'],
					placement: settings['tooltipPlacement'],
					trigger: settings['tooltipTrigger'],
					animation: settings['tooltipAnimation'],
					flipBehavior: 'clockwise',
					appendTo: $target[0],
				} );

			} );
		},

		columnEditorSettings: function( columnId ) {
			var editorElements = null,
				columnData     = {};

			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;

			if ( ! editorElements.models ) {
				return false;
			}

			$.each( editorElements.models, function( index, obj ) {

				$.each( obj.attributes.elements.models, function( index, obj ) {
					if ( columnId == obj.id ) {
						columnData = obj.attributes.settings.attributes;
					}
				} );

			} );

			return {
				'sticky': columnData['jet_tricks_column_sticky'] || false,
				'topSpacing': columnData['jet_tricks_top_spacing'] || 50,
				'bottomSpacing': columnData['jet_tricks_bottom_spacing'] || 50,
				'stickyOn': columnData['jet_tricks_column_sticky_on'] || [ 'desktop', 'tablet', 'mobile']
			}

		}

	};

	$( window ).on( 'elementor/frontend/init', JetTricks.init );

	var JetTricksTools = {
		debounce: function( threshold, callback ) {
			var timeout;

			return function debounced( $event ) {
				function delayed() {
					callback.call( this, $event );
					timeout = null;
				}

				if ( timeout ) {
					clearTimeout( timeout );
				}

				timeout = setTimeout( delayed, threshold );
			};
		}
	}

	/**
	 * Jet jetViewMore Class
	 *
	 * @return {void}
	 */
	window.jetViewMore = function( $selector, settings ) {
		var self            = this,
			$window         = $( window ),
			$button         = $( '.jet-view-more__button', $selector ),
			defaultSettings = {
				sections: {},
				effect: 'move-up',
				showall: false
			},
			settings        = $.extend( {}, defaultSettings, settings ),
			sections        = settings['sections'],
			sectionsData    = {},
			buttonVisible   = true,
			editMode        = Boolean( elementor.isEditMode() );

		/**
		 * Init
		 */
		self.init = function() {
			self.setSectionsData();

			if ( editMode ) {
				return false;
			}

			// Add Events
			$button.on( 'click', function() {



				for ( var section in sectionsData ) {
					var $section = sectionsData[ section ]['selector'];

					if ( ! settings.showall ) {
						if ( ! sectionsData[ section ]['visible'] ) {
							sectionsData[ section ]['visible'] = true;
							$section.addClass( 'view-more-visible' );
							$section.addClass( 'jet-tricks-' + settings['effect'] + '-effect' );

							break;
						}
					} else {
						sectionsData[ section ]['visible'] = true;
						$section.addClass( 'view-more-visible' );
						$section.addClass( 'jet-tricks-' + settings['effect'] + '-effect' );
					}

				}

				for ( var section in sectionsData ) {
					buttonVisible = true;

					if ( sectionsData[ section ]['visible'] ) {
						buttonVisible = false;
					}
				}

				if ( ! buttonVisible ) {
					$button.css( { 'display': 'none' } );
				}

			} );
		};

		self.setSectionsData = function() {

			for ( var section in sections ) {
				var $selector = $( '#' + sections[ section ] );

				if ( ! editMode ) {
					$selector.addClass( 'jet-view-more-section' );
				} else {
					$selector.addClass( 'jet-view-more-section-edit-mode' );
				}

				sectionsData[ section ] = {
					'section_id': sections[ section ],
					'selector': $selector,
					'visible': false,
				}
			}
		};

	}

	window.jetWidgetParallax = function( $scope ) {
		var self         = this,
			$target      = $target = $( '> .elementor-widget-container', $scope ),
			$section     = $scope.closest( '.elementor-top-section' ),
			widgetId     = $scope.data('id'),
			settings     = {},
			editMode     = Boolean( elementor.isEditMode() ),
			$window      = $( window ),
			isSafari     = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
			platform     = navigator.platform,
			safariClass  = isSafari ? 'is-safari' : '',
			macClass    = 'MacIntel' == platform ? ' is-mac' : '';

		/**
		 * Init
		 */
		self.init = function() {

			$scope.addClass( macClass );

			if ( ! editMode ) {
				settings = $scope.data( 'jet-tricks-settings' );
			} else {
				settings = self.widgetEditorSettings( widgetId );
			}

			if ( ! settings ) {
				return false;
			}

			if ( 'undefined' === typeof settings ) {
				return false;
			}

			if ( 'false' === settings['parallax'] ) {
				return false;
			}

			$window.on( 'scroll.jetWidgetParallax resize.jetWidgetParallax', self.scrollHandler ).trigger( 'resize.jetWidgetParallax' );
		};

		self.scrollHandler = function( event ) {
			var speed             = +settings['speed']['size'] * 0.01,
				invert            = 'true' == settings['invert'] ? -1 : 1,
				winHeight         = $window.height(),
				winScrollTop      = $window.scrollTop(),
				offsetTop         = $scope.offset().top,
				thisHeight        = $scope.outerHeight(),
				sectionHeight     = $section.outerHeight(),
				positionDelta     = winScrollTop - offsetTop + ( winHeight / 2 ),
				abs               = positionDelta > 0 ? 1 : -1,
				posY              = abs * Math.pow( Math.abs( positionDelta ), 0.85 ),
				availableDevices  = settings['stickyOn'] || [],
				currentDeviceMode = elementorFrontend.getCurrentDeviceMode();

			posY = invert * Math.ceil( speed * posY );

			if ( -1 !== availableDevices.indexOf( currentDeviceMode ) ) {
				$target.css( {
					'transform': 'translateY(' + posY + 'px)'
				} );
			} else {
				$target.css( {
					'transform': 'translateY(0)'
				} );
			}
		};

		self.widgetEditorSettings = function( widgetId ) {
			var editorElements = null,
				widgetData     = {};

			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;

			if ( ! editorElements.models ) {
				return false;
			}

			$.each( editorElements.models, function( index, obj ) {

				$.each( obj.attributes.elements.models, function( index, obj ) {

					$.each( obj.attributes.elements.models, function( index, obj ) {
						if ( widgetId == obj.id ) {
							widgetData = obj.attributes.settings.attributes;
						}
					} );

				} );

			} );

			return {
				'speed': widgetData['jet_tricks_widget_parallax_speed'] || { 'size': 50, 'unit': '%'},
				'parallax': widgetData['jet_tricks_widget_parallax'] || 'false',
				'invert': widgetData['jet_tricks_widget_parallax_invert'] || 'false',
				'stickyOn': widgetData['jet_tricks_widget_parallax_on'] || [ 'desktop', 'tablet', 'mobile']
			}

		}

	}

}( jQuery, window.elementorFrontend ) );
