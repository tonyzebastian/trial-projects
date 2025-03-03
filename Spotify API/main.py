from fastapi import FastAPI, Query, HTTPException
from typing import List, Optional
import sqlite3
from datetime import datetime
import json
from fastapi.responses import JSONResponse

app = FastAPI()

def get_db_connection():
    try:
        conn = sqlite3.connect('spotify_history.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@app.get("/search_track/")
async def search_track(track_name: str):
    try:
        conn = get_db_connection()
        query = """
            SELECT 
                CASE 
                    WHEN COUNT(*) > 0 THEN 'yes'
                    ELSE 'no'
                END as found_status,
                COALESCE(SUM(ms_played), 0) as total_ms_played,
                GROUP_CONCAT(DISTINCT platform) as platforms,
                GROUP_CONCAT(DISTINCT artist_name) as artists,
                GROUP_CONCAT(DISTINCT album_name) as albums
            FROM listening_history
            WHERE track_name = ?
        """
        
        # Direct match instead of LIKE
        cursor = conn.execute(query, (track_name,))
        result = dict(cursor.fetchone())
        
        return {
            "exists": result["found_status"],
            "ms_played": result["total_ms_played"],
            "platforms": result["platforms"].split(",") if result["platforms"] else [],
            "artists": result["artists"].split(",") if result["artists"] else [],
            "albums": result["albums"].split(",") if result["albums"] else []
        }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()


@app.get("/tracks/")
async def get_tracks(
    track_uri: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    platform: Optional[str] = None,
    limit: int = Query(default=100, le=1000)
):
    conn = get_db_connection()
    query = "SELECT * FROM listening_history WHERE 1=1"
    params = []
    
    if track_uri:
        query += " AND spotify_track_uri = ?"
        params.append(track_uri)
    
    if start_date:
        query += " AND ts >= ?"
        params.append(start_date)
    
    if end_date:
        query += " AND ts <= ?"
        params.append(end_date)
    
    if platform:
        query += " AND platform = ?"
        params.append(platform)
    
    query += f" LIMIT {limit}"
    
    cursor = conn.execute(query, params)
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return JSONResponse(content=results)

@app.get("/stats/")
async def get_stats(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    conn = get_db_connection()
    query = """
        SELECT 
            COUNT(*) as total_plays,
            SUM(ms_played) as total_ms_played,
            COUNT(DISTINCT spotify_track_uri) as unique_tracks,
            COUNT(DISTINCT platform) as platforms_used
        FROM listening_history
        WHERE 1=1
    """
    params = []
    
    if start_date:
        query += " AND ts >= ?"
        params.append(start_date)
    
    if end_date:
        query += " AND ts <= ?"
        params.append(end_date)
    
    cursor = conn.execute(query, params)
    results = dict(cursor.fetchone())
    conn.close()
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)