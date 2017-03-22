app_angular.controller("PedidosController",['Conexion','$scope','$route',function (Conexion,$scope,$route) {
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.validacion=false;
	$scope.pedidos = [];
	$scope.TABLA_BALANCE=JSON.parse(window.localStorage.getItem("TABLA_BALANCE"));
	$scope.pedidoSeleccionado=[];
	$scope.detallespedido=[];
	CRUD.select('select*from t_pedidos',function(elem){
	})
	$scope.cargarLista=function()
	{
		$scope.pedidos=[];
		CRUD.select('select distinct pedidos.sincronizado,pedidos.valor_impuesto,pedidos.fecha_solicitud,pedidos.sincronizado,pedidos.fecha_entrega, pedidos.rowid as rowidpedido,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total,detalle.rowid_pedido,count(detalle.rowid_pedido) cantidaddetalles,sum(detalle.cantidad) as cantidadproductos,pedidos.numpedido_erp,pedidos.estado_erp from  t_pedidos pedidos inner join erp_terceros_sucursales sucursal on sucursal.rowid=pedidos.rowid_cliente_facturacion  inner join erp_terceros terceros on terceros.rowid=sucursal.rowid_tercero  left  join t_pedidos_detalle detalle on detalle.rowid_pedido=pedidos.rowid left join erp_terceros_punto_envio punto_envio on punto_envio.rowid=pedidos.id_punto_envio where pedidos.sincronizado!="EnvioCorrecto" and  pedidos.ambiente="'+$scope.sessiondate.codigo_empresa+'" and  pedidos.usuariocreacion="'+$scope.sessiondate.nombre_usuario+'" group by  pedidos.fecha_solicitud,detalle.rowid_pedido,pedidos.rowid,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total order by pedidos.rowid desc    LIMIT 50',
			function(elem) {elem.tablamobile=1;$scope.pedidos.push(elem)});
		window.setTimeout(function() {
			CRUD.select('select distinct pedidos.sincronizado,pedidos.valor_impuesto,pedidos.fecha_solicitud,pedidos.sincronizado,pedidos.fecha_entrega, pedidos.rowid as rowidpedido,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total,detalle.rowid_pedido,count(detalle.rowid_pedido) cantidaddetalles,sum(detalle.cantidad) as cantidadproductos,pedidos.numpedido_erp,pedidos.estado_erp from  t_pedidos_web pedidos inner join erp_terceros_sucursales sucursal on sucursal.rowid=pedidos.rowid_cliente_facturacion  inner join erp_terceros terceros on terceros.rowid=sucursal.rowid_tercero  left  join t_pedidos_detalle_web detalle on detalle.rowid_pedido=pedidos.rowid left join erp_terceros_punto_envio punto_envio on punto_envio.rowid=pedidos.id_punto_envio where pedidos.usuariocreacion="'+$scope.sessiondate.nombre_usuario+'"  group by  pedidos.fecha_solicitud,detalle.rowid_pedido,pedidos.rowid,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total order by pedidos.rowid desc    LIMIT 50',
			function(elem) {elem.tablamobile=0;$scope.pedidos.push(elem)});
		},2000);	
	}
	$scope.cargarLista();

	CRUD.select("select count(*) as cantidad",function(elem){
		if (elem.cantidad==0) {
			$scope.validacion=true;
		}
	})
	$scope.fechaDefault='';
	$scope.FechaEntregaP=function()
	{
		var hoy = new Date();
		var count=0;
		while (count<3) {
		  hoy.setTime(hoy.getTime()+24*60*60*1000); // añadimos 1 día
		  if ( hoy.getDay() != 0)
		  {
			var d = new Date(hoy),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();
		    if (month.length < 2) month = '0' + month;
		    if (day.length < 2) day = '0' + day;
	    	var diaSeleccionado= [year, month, day].join('-');
			for (var  i= 0; i < DiasFestivos.length; i++) {
				if (diaSeleccionado==DiasFestivos[i]) {
					hoy.setDate(hoy.getDate() + 1);
				}
			}
		  	count++;  
		  }
		}
		$scope.fechaDefault=hoy;
		//document.getElementById("FechaEntrega").valueAsDate = hoy;
		//$scope.FechaEntrega=	hoy;
	}
	$scope.PedidoConfirmado=function()
	{
		if ($scope.FechaEntrega=='' || $scope.FechaEntrega==undefined) 
		{
			Mensajes('Por favor seleccionar fecha de entrega','error','');
			return;
		}
		var hoy = new Date($scope.FechaEntrega);
		month = '' + (hoy.getMonth() + 1),
        day = '' + hoy.getDate(),
        year = hoy.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

		var dia1=  [year, month, day].join('-');
		CRUD.Updatedynamic("update t_pedidos set fecha_entrega='"+dia1+"' where rowid='"+$scope.pedidoSeleccionado.rowidpedido+"'")
		$scope.FechaEntrega='';
		document.getElementById("FechaEntrega").valueAsDate = null;
		$('#closeconfirmacion').click();
		$scope.build();	
	}

	$scope.FechaEntregaP();
	$scope.onChangeFechaEntrega=function()
	{
		
		var hoy = new Date($scope.FechaEntrega);
		month = '' + (hoy.getMonth() + 1),
        day = '' + hoy.getDate(),
        year = hoy.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

		var dia1=  [year, month, day].join('');
		
		month = '' + ($scope.fechaDefault.getMonth() + 1),
        day = '' + $scope.fechaDefault.getDate(),
        year = $scope.fechaDefault.getFullYear();
		
	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
	    var dia2=[year, month, day].join('');;
		debugger
		if (dia2>dia1) {
			Mensajes('Dias minimos de entrega son 3 Dias','error','');
			$scope.FechaEntrega='';
			document.getElementById("FechaEntrega").valueAsDate = null;
			return;
		}
		var i=hoy.getDay()
		var d = new Date(hoy),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

    	var diaSeleccionado= [year, month, day].join('-');
		for (var i =0;i<DiasFestivos.length;i++) {
			if (diaSeleccionado==DiasFestivos[i]) {
				Mensajes('No se puede seleccionar un dia festivo','error','');
				$scope.FechaEntrega='';
				document.getElementById("FechaEntrega").valueAsDate = null;
				return;
			}
		}
	}
	$scope.ConfirmacionFechaentrega=function()
	{
		$('#modalClose').click();
		$('#confirmacionFechaentrega').click();
	}
	$scope.ConsultarDatos=function(pedido){
		$scope.detallespedido=[];
		$scope.pedidoSeleccionado=pedido;
		
		$scope.contadores=[];
		$scope.tallasAgregar=[];
		$scope.contadores.cont1=0;
		$scope.contadores.cont2=0;
		$scope.contadores.cont3=0;
		$scope.contadores.cont4=0;
		$scope.contadores.cont5=0;
		$scope.tabla1='';
		$scope.tabla2='';
		$scope.origen='';
		if (pedido.tablamobile==1) {
			$scope.tabla1='t_pedidos';
			$scope.tabla2='t_pedidos_detalle';
			$scope.origen='MOBILE';
		}
		else
		{
			$scope.tabla1='t_pedidos_web';
			$scope.tabla2='t_pedidos_detalle_web';	
			$scope.origen='WEB';
		}
		var query1="select distinct dt.rowid_item,dt.linea_descripcion,dt.rowid_pedido,item.item_referencia,dt.empaque  from "+$scope.tabla2+" dt inner join erp_items item on item.rowid=dt.rowid_item where dt.rowid_pedido ='"+pedido.rowidpedido+"'";

		CRUD.select(query1,function(elem){
			$scope.pedidoSeleccionado.validacionPedido=true;
			elem.tallas=[];
			elem.origen=$scope.origen;
			elem.cantidadtotal=0;
			$scope.detallespedido.unshift(elem);
			$scope.contadores.cont1++;
			var query2="select count(*) as c   from "+$scope.tabla2+" where rowid_item='"+elem.rowid_item+"'  and  rowid_pedido='"+elem.rowid_pedido+"' ";
			CRUD.select(query2,function(contadorItems){
				var query3="select "+contadorItems.c+" as contador ,rowid_item_ext, item_ext1 as talla,cantidad,rowid_item from "+$scope.tabla2+" where rowid_item='"+elem.rowid_item+"'  and  rowid_pedido='"+elem.rowid_pedido+"' order by rowid_item_ext asc"
				CRUD.select(query3,function(tallas){
					$scope.contadores.cont4++;
					$scope.indicePush=true;
					$scope.indicemenor=true;
					for (var i =0;i<$scope.detallespedido.length;i++) {
						var a=$scope.detallespedido[i].rowid_item;
						if (a==tallas.rowid_item) {
							$scope.generico=[];
							$scope.generico.contador=0;
							$scope.generico.talla=0;
							$scope.generico.cantidad=0;
							$scope.generico.rowid_item=0;
							for (var f=1;f<9;f++) {
								$scope.generico.rowid_item_ext=f;
								if (f<tallas.rowid_item_ext && $scope.detallespedido[i].tallas.length+1!=tallas.rowid_item_ext && $scope.indicemenor) {
									$scope.detallespedido[i].tallas.push($scope.generico)
									
								}
								else if ( ($scope.indicePush && f==tallas.rowid_item_ext) || ($scope.detallespedido[i].tallas.length+1==tallas.rowid_item_ext  && $scope.indicePush))
								{
									$scope.detallespedido[i].tallas.push(tallas)
									$scope.detallespedido[i].cantidadtotal+=tallas.cantidad;
									$scope.contadores.cont5+=tallas.cantidad;
									$scope.indicemenor=false;
									$scope.indicePush=false;
								}
								else if ($scope.contadores.cont4>=tallas.contador) {
									
									if ($scope.detallespedido[i].tallas.length<8) {
										$scope.detallespedido[i].tallas.push($scope.generico)
									}
									if ($scope.detallespedido[i].tallas.length+1==9) {
										$scope.contadores.cont4=0;
									}
									
								}
								
							}
							
							
						}
						
					}
				})
			})
		})
			
	}
	$scope.Refrescar =function(){
		CRUD.selectAll('t_pedidos',function(elem) {$scope.pedidos.push(elem)});
		$scope.Search = '';
		
	}
	
	angular.element('ul.tabs li').click(function () {

		var tab_id = angular.element(this).find('a').data('tab');
		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');
		angular.element(this).toggleClass('active');
		angular.element("#" + tab_id).toggleClass('active');
	});
	
	$scope.abrirModal=function(pedido){
		$('#pedidoOpenModal').click();
		$scope.ConsultarDatos(pedido);
	}
	$scope.onretomarPedido=function(rowid_pedido){
	}
	//CRUD.Updatedynamic("delete from s_planos_pedidos");
	//CRUD.Updatedynamic("update t_pedidos set estado_sincronizacion=0,sincronizado='false' where rowid=10057");
	$scope.CambiarTab = function (tab_actual, accion) {
		var tab_id = null;

		if (tab_actual == '1' && accion == 'siguiente')
			tab_id = 'tab_2';

		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');

		angular.element("ul.tabs").find("[data-tab='" + tab_id + "']").toggleClass('active');
		angular.element("#" + tab_id).toggleClass('active');
	};
	angular.element('#ui-id-1').mouseover(function (){
		angular.element('#ui-id-1').show();
	
	});
	//CRUD.selectAllinOne("select sum(tpd.cantidad) from t_pedidos p left join t_pedidos_detalle tpd on p.rowid=tpd.rowid_pedido  where p.rowid=10068",function(elem){debugger})
	//CRUD.selectAllinOne("select sum(tpdd.cantidad) from t_pedidos p left join t_pedidos_detalle tpd on p.rowid=tpd.rowid_pedido left join t_pedidos_detalle_detalle tpdd on tpd.rowid=tpdd.pedidoDetalle where p.rowid=10069",function(elem){debugger})
	//CRUD.select("select sum(d_cantidad) from s_planos_pedidos where e_rowid=10068",function(elem){debugger})
	//CRUD.select("select count(*) from t_pedidos_detalle where rowid_pedido=10068",function(elem){debugger})
	$scope.build=function(rowid){
		$('.confirmarEnvio').attr('disabled','disabled');
		ProcesadoShow();   
		$scope.queryBuild='    select  '+
		   ' t.key_user,'+
		   ' t.rowid_empresa,'+
			't.id_cia,t.usuariocreacion,'+
			't.fechacreacion,'+
			't.rowid as e_rowid, '+
			't.rowid_cliente_facturacion as  e_rowid_cliente_facturacion,'+
			't.rowid_cliente_despacho as e_rowid_cliente_despacho,'+
			't.rowid_lista_precios as e_rowid_lista_precios,'+
			't.id_punto_envio as e_id_punto_envio,'+
			't.fecha_pedido as e_fecha_pedido,'+
			't.fecha_entrega as e_fecha_entrega,'+
			't.valor_base as e_valor_base,'+
			't.valor_descuento as e_valor_descuento,'+
			't.valor_impuesto as e_valor_impuesto,'+
			't.valor_total as e_valor_total,'+
			't.id_estado as e_id_estado,'+
			't.ind_estado_erp as e_ind_estado_erp,'+
			't.valor_facturado as e_valor_facturado,'+
			't.fecha_solicitud as e_fechasolicitud,'+
			't.orden_compra as e_orden_compra,'+
			't.modulo_creacion as e_modulo_creacion,'+
			't.observaciones as e_observaciones,'+
			'tpd.rowid as d_rowid,'+
			'tpd.rowid_pedido as d_rowid_pedido,'+
			'tpd.rowid_item as d_rowid_item,'+
			'tpd.linea_descripcion as d_linea_descripcion,'+
			'tpd.id_unidad as d_id_unidad,'+
			'tpd.cantidad as d_cantidad,'+
			'tpd.factor as d_factor,'+
			'tpd.cantidad_base as d_cantidad_base,'+
		   'tpd.stock as d_stock,'+
			'tpd.porcen_descuento as d_porcen_descuento,'+
			'tpd.valor_base as d_valor_base,'+
			'tpd.valor_impuesto as d_valor_impuesto,'+
			'tpd.valor_total_linea as d_valor_total_linea,'+
			'tpd.item_ext1 as d_item_ext1,'+
			'tpd.rowid_item_ext as d_rowid_item_ext,'+
			'tpd.empaque as d_empaque,'+
			'tpd.observaciones as d_observaciones,'+
			'tpd.rowid_bodega as d_rowid_bodega,'+
			'tpd.precio_unitario as d_precio_unitario,'+
			'tpd.valor_descuento as d_valor_descuento,'+
			'tpdd.rowid as s_rowid,'+
			'tpdd.pedidodetalle as s_rowid_detalle,'+
			'tpdd.cantidad as s_cantidad,'+
			'tpdd.itemExtension2Detalle as s_itemextencion2detalle '+
			' from t_pedidos t'+
			' inner  join  t_pedidos_detalle tpd '+
			' on tpd.rowid_pedido=t.rowid'+
			' inner  join t_pedidos_detalle_detalle tpdd '+
			' on tpdd.pedidodetalle=tpd.rowid   where  t.rowid= __REQUIRED  and estado_sincronizacion=0 '+
			' order by t.rowid asc';


		$scope.queryBuild=$scope.queryBuild.replace('__REQUIRED',$scope.pedidoSeleccionado.rowid_pedido)
		CRUD.selectAllinOne($scope.queryBuild,function(ped){
				var rowidPedido=0;
				var contador=0;
				var  stringSentencia='';
				var NewQuery=true;
				var ultimoregistro=ped.length-1;
				var step=0;
				for (var i =0;i<ped.length;i++) {
					contador++
					if (ultimoregistro==i) {
						step=1
					}
					rowidPedido=ped[i].e_rowid
					if (NewQuery) {
						stringSentencia=" insert into s_planos_pedidos  ";
						NewQuery=false;
					}
					else{
						stringSentencia+= "   UNION   ";
					}
					stringSentencia+=  "  SELECT  "+
					//ped[i].e_rowid+

					"null,'"+ped[i].key_user+
					"','"+ped[i].rowid_empresa+
					"','"+ped[i].id_cia+
					"','"+ped[i].key_user+
					"','"+ped[i].usuariocreacion+
					"','"+ped[i].fechacreacion+
					"','"+ped[i].e_rowid+
					"','"+ped[i].e_rowid_cliente_facturacion+
					"','"+ped[i].e_rowid_cliente_despacho+
					"','"+ped[i].e_rowid_lista_precios+
					"','"+ped[i].e_id_punto_envio+
					"','"+ped[i].e_fecha_pedido+
					"','"+ped[i].e_fecha_entrega+
					"','"+ped[i].e_valor_base+
					"','"+ped[i].e_valor_descuento+
					"','"+ped[i].e_valor_impuesto+
					"','"+ped[i].e_valor_total+
					"','"+ped[i].e_id_estado+
					"','"+ped[i].e_ind_estado_erp+
					"','"+ped[i].e_valor_facturado+
					"','"+ped[i].e_fechasolicitud+
					"','"+ped[i].e_orden_compra+
					"','"+ped[i].e_modulo_creacion+
					"','"+ped[i].e_observaciones+
					"','"+ped[i].d_rowid+
					"','"+ped[i].d_rowid_pedido+
					"','"+ped[i].d_rowid_item+
					"','"+ped[i].d_linea_descripcion+
					"','"+ped[i].d_id_unidad+
					"','"+ped[i].d_cantidad+
					"','"+ped[i].d_factor+
					"','"+ped[i].d_cantidad_base+
					"','"+ped[i].d_stock+
					"','"+ped[i].d_porcen_descuento+
					"','"+ped[i].d_valor_base+
					"','"+ped[i].d_valor_impuesto+
					"','"+ped[i].d_valor_total_linea+
					"','"+ped[i].d_item_ext1+
					"','"+ped[i].d_rowid_item_ext+
					"','"+ped[i].d_empaque+
					"','"+ped[i].d_observaciones+
					"','"+ped[i].d_rowid_bodega+
					"','"+ped[i].s_rowid+
					"','"+ped[i].s_rowid_detalle+
					"','"+ped[i].s_cantidad+
					"','"+ped[i].s_itemextencion2detalle+
					"',0,"+step+",0,0,'"+ped[i].d_precio_unitario+"','"+ped[i].d_valor_descuento+"','"+ped.length+"' "; 
					if (contador==499) {
						CRUD.Updatedynamic(stringSentencia)
						NewQuery=true;
						stringSentencia="";
						contador=0;
					}
				}
				if (stringSentencia!='') {
					CRUD.Updatedynamic(stringSentencia)
					NewQuery=true;
					CRUD.Updatedynamic("update t_pedidos set estado_sincronizacion=1,sincronizado='plano' where rowid="+rowidPedido+"");
				}
				window.setTimeout(function(){
					ProcesadoHiden();
					//$route.reload();
					Mensajes('Listo Para Enviar','success','');
					$scope.pedidos=[];
					$scope.cargarLista();
					$(".confirmarEnvio").removeAttr("disabled");
					$('#modalClose').click();
				},25000)
			})

		
	}
	$scope.ItemModal=[];
	$scope.ColoresModal=[];
	$scope.ModalColoreOpen=false;
	$scope.ModalItem=function(item){
		if (item.origen=="WEB") {
			$scope.ColoresModal=[];
			$scope.ModalColoreOpen=true;
			$('#ColoresAgregados').click();
			$scope.ItemModal=[];
			$scope.ItemModal=angular.copy(item)	;
			for (var i = 0; i < $scope.ItemModal.tallas.length; i++) {
				if ( $scope.ItemModal.tallas[i].cantidad>0) {
					$scope.ItemModal.tallas[i].colores=[];
					CRUD.selectAllinOne("select  '"+i+"' as array,c.*,b.cantidad from t_pedidos_detalle_web a inner join t_pedidos_detalle_detalle_web  b on b.pedidoDetalle=a.rowid left join erp_item_extencion2_detalle c on c.rowid_erp=b.itemExtension2Detalle  where a.rowid_pedido='"+item.rowid_pedido+"' and  a.rowid_item='"+item.rowid_item+"'  and a.item_ext1='"+$scope.ItemModal.tallas[i].talla+"'",function(elem){
						if (elem.length>0) {
							$scope.ItemModal.tallas[elem[0].array].colores=elem;
						}
					})
				}
				else
				{
					$scope.ItemModal.tallas[i]=[];			
				}
			}
		}
		else
		{
			$scope.ColoresModal=[];
			$scope.ModalColoreOpen=true;
			$('#ColoresAgregados').click();
			$scope.ItemModal=[];
			$scope.ItemModal=angular.copy(item)	;
			for (var i = 0; i < $scope.ItemModal.tallas.length; i++) {
				if ( $scope.ItemModal.tallas[i].cantidad>0) {
					$scope.ItemModal.tallas[i].colores=[];
					CRUD.selectAllinOne("select  '"+i+"' as array,c.*,b.cantidad from t_pedidos_detalle a inner join t_pedidos_detalle_detalle  b on b.pedidoDetalle=a.rowid left join erp_item_extencion2_detalle c on c.rowid_erp=b.itemExtension2Detalle  where a.rowid_pedido='"+item.rowid_pedido+"' and  a.rowid_item='"+item.rowid_item+"'  and a.item_ext1='"+$scope.ItemModal.tallas[i].talla+"'",function(elem){
						if (elem.length>0) {
							$scope.ItemModal.tallas[elem[0].array].colores=elem;
						}
					})
				}
				else
				{
					$scope.ItemModal.tallas[i]=[];	
					$scope.ItemModal.tallas[i].cantidad=0;		
				}
			}
		}
		
	}
	$scope.$on('$routeChangeStart', function(event,next, current) { 
		if ($scope.ModalColoreOpen==true) {
			$scope.ModalColoreOpen=false;
			event.preventDefault();
			$('#modalBalanceColores').click();
			return;
		}
		
		  
	 });
}]);
