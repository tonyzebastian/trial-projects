import pandas as pd
import sqlite3

def create_database():
    # Read CSV file
    df = pd.read_csv('spotify_history.csv')
    
    # Ensure column names match exactly
    expected_columns = [
        'spotify_track_uri',
        'ts',
        'platform',
        'ms_played',
        'track_name',
        'artist_name',
        'album_name',
        'reason_start',
        'reason_end',
        'shuffle',
        'skipped'
    ]
    
    # Create SQLite connection
    conn = sqlite3.connect('spotify_history.db')
    
    # Create table and load data
    df.to_sql('listening_history', conn, if_exists='replace', index=False)
    
    # Create indices for better query performance
    conn.execute('CREATE INDEX IF NOT EXISTS idx_track_name ON listening_history(track_name)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_track_uri ON listening_history(spotify_track_uri)')
    
    conn.close()
    print("Database created successfully!")

if __name__ == "__main__":
    create_database()