import numpy as np
import pandas as pd
import os


def combine_directors(df):

    df = df[df["Role"] == "Director"]
    movie_ids = df["Movie_ID"].unique()

    directors = []
    for id in movie_ids:


        directors_in_id = df[df["Movie_ID"] == id]["Member_Name"].tolist()
        director_str = directors_in_id[0]

        for i in range(1,len(directors_in_id)):
            director_str += ", " + directors_in_id[i]

        directors.append(director_str)

    return pd.DataFrame(np.column_stack((movie_ids, directors)), columns = ["Movie_ID", "Director"])

def convert_money(df):

    gross_df = df["Lifetime_Gross"]
    gross_list = []

    for i in range(len(gross_df)):

        parts = gross_df[i].split("$")
        parts = parts[1].split(",")[::-1]

        new_format = 0
        for p in range(len(parts)):

            new_format += int(parts[p]) * pow(10, p * 3)

        gross_list.append(new_format)

    df["Lifetime_Gross"] = gross_list
    return df




if __name__ == '__main__':

    if "movies.csv" in os.listdir("./"):
        os.remove("movies.csv")

    bo_summary = pd.read_csv("./movies_box_office/bo_summary.csv")
    movie_directors = pd.read_csv("./movies_box_office/movie_crew_data.csv")
    movie_summary = pd.read_csv("./movies_box_office/movie_summary.csv")

    movie_directors = combine_directors(movie_directors)
    bo_summary = convert_money(bo_summary)

    movies_df = pd.merge(movie_summary, bo_summary[["Rank", "Lifetime_Gross", "Year" , "Movie_ID"]], on = "Movie_ID")
    movies_df = pd.merge(movies_df, movie_directors, on = "Movie_ID")


    columns_reodered = ['Rank', 'Movie_ID', 'Movie_Name', 'Director', 'Year', 'US_Distributor', 'Lifetime_Gross', 'Budget', 'MPAA',
       'Running_Time', 'Genre']

    movies_df = movies_df.reindex(columns = columns_reodered)

    movies_df.to_csv('movies.csv', index=False)
