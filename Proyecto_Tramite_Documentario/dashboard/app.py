import os
import dash
from dash import dcc, html
import plotly.express as px
import pandas as pd
import psycopg2

# 1. Configuración de Conexión a Base de Datos (Clara y simple)
# NOTA: En un entorno real, usaríamos variables de entorno (os.getenv)
DB_CONFIG = {
    "dbname": "tramite",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "port": "5432"
}

# 2. Función para extraer los datos de la base de datos
def get_data():
    try:
        # Intentamos conectar a la BD
        conn = psycopg2.connect(**DB_CONFIG)
        
        # Consulta 1: Documentos por Estado (para gráfico de torta)
        query_estados = """
            SELECT e.nombre as estado, COUNT(d.id_documento) as cantidad
            FROM documento d
            JOIN estado_documento e ON d.id_estado_documento = e.id_estado_documento
            GROUP BY e.nombre;
        """
        df_estados = pd.read_sql_query(query_estados, conn)
        
        # Consulta 2: Carga Laboral por Área (para gráfico de barras)
        query_areas = """
            SELECT a.nombre as area, COUNT(d.id_derivacion) as derivaciones
            FROM derivacion d
            JOIN empleado emp ON d.receptor_id = emp.id_empleado
            JOIN area a ON emp.id_area = a.id_area
            GROUP BY a.nombre;
        """
        df_areas = pd.read_sql_query(query_areas, conn)
        
        conn.close()
        return df_estados, df_areas
    
    except Exception as e:
        print(f"Error conectando a la base de datos: {e}")
        # Si falla la conexión, devolvemos dataframes vacíos o de prueba para no quebrar la app
        df_estados = pd.DataFrame({"estado": ["Pendiente", "Derivado", "Respondido"], "cantidad": [10, 5, 15]})
        df_areas = pd.DataFrame({"area": ["Gerencia", "Logística", "Mesa de Partes"], "derivaciones": [5, 12, 8]})
        return df_estados, df_areas

# 3. Inicializar la aplicación Dash
app = dash.Dash(__name__)
app.title = "Dashboard Trámite Documentario"

# 4. Obtener datos y crear figuras (gráficos)
df_estados, df_areas = get_data()

fig_estados = px.pie(
    df_estados, 
    values='cantidad', 
    names='estado', 
    title='Proporción de Documentos por Estado',
    hole=0.4 # Estilo "Donut" para verse más moderno
)

fig_areas = px.bar(
    df_areas, 
    x='area', 
    y='derivaciones', 
    title='Carga Laboral: Derivaciones por Área',
    color='area'
)

# 5. Definir el Layout (La estructura visual de la app)
app.layout = html.Div(
    style={'fontFamily': 'system-ui, sans-serif', 'padding': '2rem', 'backgroundColor': '#f9fafb', 'minHeight': '100vh'},
    children=[
        html.H1("Dashboard Analítico: Gestión Documental", style={'textAlign': 'center', 'color': '#1f2937'}),
        html.P("Módulo complementario para supervisión y carga laboral de la Mype Agroexportadora.", style={'textAlign': 'center', 'color': '#6b7280', 'marginBottom': '2rem'}),
        
        html.Div(
            style={'display': 'flex', 'gap': '2rem', 'justifyContent': 'center', 'flexWrap': 'wrap'},
            children=[
                # Tarjeta del gráfico de estados
                html.Div(
                    style={'backgroundColor': 'white', 'padding': '1rem', 'borderRadius': '0.5rem', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)', 'flex': '1', 'minWidth': '400px'},
                    children=[dcc.Graph(figure=fig_estados)]
                ),
                # Tarjeta del gráfico de áreas
                html.Div(
                    style={'backgroundColor': 'white', 'padding': '1rem', 'borderRadius': '0.5rem', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)', 'flex': '1', 'minWidth': '400px'},
                    children=[dcc.Graph(figure=fig_areas)]
                )
            ]
        )
    ]
)

# 6. Ejecutar el servidor web
if __name__ == '__main__':
    # debug=True permite que la app se actualice sola si cambiamos el código
    app.run(debug=True, port=8050)
